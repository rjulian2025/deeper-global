const TREND_EVENT_NAME = 'trend_region_sync';
const ANTHROPIC_MODEL = 'claude-sonnet-4-6';
const POETIC_CLOSER = 'This map changes every 48 hours. So does the way people feel.';

const SYSTEM_PROMPT =
  'You are the editorial voice of Deeper Global, a mental health intelligence platform. You write insight copy that is culturally observant, emotionally intelligent, and occasionally poetic. Never clinical. Never preachy. Write like someone who has been watching the American psyche for a long time and finds it endlessly fascinating.';

const US_STATE_NAMES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

const REGIONS = {
  South: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'SC', 'TN', 'TX', 'VA', 'WV'],
  West: ['AK', 'AZ', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'NM', 'OR', 'UT', 'WA', 'WY'],
  Midwest: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
  Northeast: ['CT', 'DE', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
};

function getSupabaseReadConfig() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, supabaseServiceRoleKey };
}

function stateName(code) {
  if (typeof code !== 'string' || !code) return null;
  return US_STATE_NAMES[code] ?? code;
}

function normalizeTrendEventRow(row) {
  const eventCount = Number(row.event_count ?? 0);
  const occurredAt = typeof row.occurred_at === 'string' ? row.occurred_at : '';

  return {
    country: row.region_country ?? null,
    state: row.region_state ?? null,
    category: row.category ?? null,
    day: occurredAt.slice(0, 10) || null,
    event_count: Number.isFinite(eventCount) ? Math.round(eventCount) : 0,
  };
}

async function fetchTrendRows() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseReadConfig();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { ok: false, reason: 'missing_supabase_service_role_key' };
  }

  const params = new URLSearchParams({
    select: 'region_country,region_state,category,occurred_at,event_count:metadata->>trend_score',
    event_name: `eq.${TREND_EVENT_NAME}`,
    region_country: 'eq.US',
    order: 'occurred_at.desc',
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/intent_events?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  const rows = await response.json();
  return { ok: true, data: Array.isArray(rows) ? rows.map(normalizeTrendEventRow) : [] };
}

function latestDayRows(rows) {
  const latestDay = rows.reduce((max, row) => (row.day && row.day > max ? row.day : max), '');
  if (!latestDay) return { day: null, rows: [] };

  return {
    day: latestDay,
    rows: rows.filter((row) => row.day === latestDay && row.state && row.category && row.event_count > 0),
  };
}

function roundAverage(total, count) {
  if (!count) return 0;
  return Math.round((total / count) * 10) / 10;
}

function computeStats(rows, dataDay) {
  const byStateCategory = new Map();
  const byCategoryNational = new Map();
  const byStateCategories = new Map();

  for (const row of rows) {
    const stateCategoryKey = `${row.state}|${row.category}`;
    byStateCategory.set(stateCategoryKey, (byStateCategory.get(stateCategoryKey) ?? 0) + row.event_count);
    byCategoryNational.set(row.category, (byCategoryNational.get(row.category) ?? 0) + row.event_count);

    const stateBucket = byStateCategories.get(row.state) ?? new Map();
    stateBucket.set(row.category, (stateBucket.get(row.category) ?? 0) + row.event_count);
    byStateCategories.set(row.state, stateBucket);
  }

  let nationalLeader = null;
  let lowestNationalCategory = null;

  for (const [category, event_count] of byCategoryNational.entries()) {
    if (!nationalLeader || event_count > nationalLeader.event_count) {
      nationalLeader = { category, event_count };
    }
    if (!lowestNationalCategory || event_count < lowestNationalCategory.event_count) {
      lowestNationalCategory = { category, event_count };
    }
  }

  const stateLeaders = {};
  const leaderCategoryCounts = new Map();

  for (const [state, categories] of byStateCategories.entries()) {
    let leader = null;

    for (const [category, event_count] of categories.entries()) {
      if (!leader || event_count > leader.event_count) {
        leader = { category, event_count };
      }
    }

    if (!leader) continue;

    stateLeaders[state] = {
      state,
      state_name: stateName(state),
      category: leader.category,
      event_count: leader.event_count,
    };

    leaderCategoryCounts.set(leader.category, (leaderCategoryCounts.get(leader.category) ?? 0) + 1);
  }

  let dominantCategoryByStates = null;
  for (const [category, state_count] of leaderCategoryCounts.entries()) {
    if (!dominantCategoryByStates || state_count > dominantCategoryByStates.state_count) {
      dominantCategoryByStates = { category, state_count };
    }
  }

  let highestSingleSignal = null;
  for (const [key, event_count] of byStateCategory.entries()) {
    const [state, category] = key.split('|');
    if (!highestSingleSignal || event_count > highestSingleSignal.event_count) {
      highestSingleSignal = {
        state,
        state_name: stateName(state),
        category,
        event_count,
      };
    }
  }

  const regionalPatterns = {};
  const topCategoryPerRegion = {};

  for (const [regionName, stateCodes] of Object.entries(REGIONS)) {
    const categoryTotals = new Map();
    const categoryStateCounts = new Map();

    for (const state of stateCodes) {
      const categories = byStateCategories.get(state);
      if (!categories) continue;

      for (const [category, event_count] of categories.entries()) {
        categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + event_count);
        categoryStateCounts.set(category, (categoryStateCounts.get(category) ?? 0) + 1);
      }
    }

    const averages = {};
    for (const [category, total] of categoryTotals.entries()) {
      averages[category] = roundAverage(total, categoryStateCounts.get(category) ?? 0);
    }
    regionalPatterns[regionName] = averages;

    let regionLeader = null;
    for (const [category, total_event_count] of categoryTotals.entries()) {
      if (!regionLeader || total_event_count > regionLeader.total_event_count) {
        regionLeader = {
          category,
          total_event_count,
          average_event_count: roundAverage(total_event_count, categoryStateCounts.get(category) ?? 0),
        };
      }
    }

    if (regionLeader) topCategoryPerRegion[regionName] = regionLeader;
  }

  let outlierState = null;
  for (const [state, leader] of Object.entries(stateLeaders)) {
    const nationalLeaderCount = leaderCategoryCounts.get(leader.category) ?? 0;
    const candidate = {
      state,
      state_name: leader.state_name,
      category: leader.category,
      event_count: leader.event_count,
      states_led_nationally: nationalLeaderCount,
    };

    if (
      !outlierState ||
      candidate.states_led_nationally < outlierState.states_led_nationally ||
      (candidate.states_led_nationally === outlierState.states_led_nationally &&
        candidate.event_count > outlierState.event_count)
    ) {
      outlierState = candidate;
    }
  }

  let mostEvenState = null;
  for (const [state, categories] of byStateCategories.entries()) {
    const ranked = Array.from(categories.entries())
      .map(([category, event_count]) => ({ category, event_count }))
      .sort((a, b) => b.event_count - a.event_count);

    if (ranked.length < 2) continue;

    const gap = ranked[0].event_count - ranked[1].event_count;
    const candidate = {
      state,
      state_name: stateName(state),
      top_category: ranked[0].category,
      top_event_count: ranked[0].event_count,
      second_category: ranked[1].category,
      second_event_count: ranked[1].event_count,
      gap,
    };

    if (!mostEvenState || candidate.gap < mostEvenState.gap) {
      mostEvenState = candidate;
    }
  }

  return {
    data_day: dataDay,
    national_leader: nationalLeader,
    state_leaders: stateLeaders,
    dominant_category_by_states: dominantCategoryByStates,
    highest_single_signal: highestSingleSignal,
    regional_patterns: regionalPatterns,
    top_category_per_region: topCategoryPerRegion,
    outlier_state: outlierState,
    most_even_state: mostEvenState,
    lowest_national_category: lowestNationalCategory,
  };
}

function buildUserPrompt(stats) {
  return `Based on this week's mental health search data across US states, write exactly 4 insight sentences. Each should be a standalone observation — surprising, specific, and human. Draw on regional patterns, outliers, concentrations, and tensions in the data. The last sentence must always be: '${POETIC_CLOSER}' Return only a JSON array of 4 strings, no other text.

Data: ${JSON.stringify(stats)}`;
}

function parseInsightsJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  const parsed = JSON.parse(candidate);
  if (!Array.isArray(parsed) || parsed.length !== 4 || !parsed.every((item) => typeof item === 'string' && item.trim())) {
    throw new Error('invalid_insights_array');
  }

  const insights = parsed.map((item) => item.trim());
  insights[3] = POETIC_CLOSER;
  return insights;
}

async function generateInsightsWithAnthropic(stats) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      temperature: 0.8,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(stats) }],
    }),
  });

  if (!response.ok) {
    throw new Error(`anthropic_request_failed:${response.status}`);
  }

  const payload = await response.json();
  const textBlock = payload.content?.find((block) => block.type === 'text');
  if (!textBlock?.text) {
    throw new Error('anthropic_empty_response');
  }

  return parseInsightsJson(textBlock.text);
}

function buildFallbackInsights(stats) {
  const bullets = [];

  if (stats.highest_single_signal) {
    const { state_name, category, event_count } = stats.highest_single_signal;
    bullets.push(
      `${state_name} shows the strongest single signal this week: ${category} scored ${event_count}.`
    );
  }

  if (stats.national_leader) {
    bullets.push(`Nationally, ${stats.national_leader.category} leads search interest across all states.`);
  }

  if (stats.outlier_state) {
    bullets.push(
      `${stats.outlier_state.state_name} stands apart — ${stats.outlier_state.category} tops the state, even though only ${stats.outlier_state.states_led_nationally} states share that leader.`
    );
  } else if (stats.dominant_category_by_states) {
    bullets.push(
      `${stats.dominant_category_by_states.category} leads in ${stats.dominant_category_by_states.state_count} states this week — the most common #1 across the map.`
    );
  }

  bullets.push(POETIC_CLOSER);
  return bullets.slice(0, 4);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const result = await fetchTrendRows();

    if (!result.ok) {
      console.error('insights_not_loaded', result.reason);
      return res.status(500).json({ error: 'insights_query_failed' });
    }

    const { day, rows } = latestDayRows(result.data);
    const stats = computeStats(rows, day);

    let insights;
    let source = 'fallback';

    try {
      const generated = await generateInsightsWithAnthropic(stats);
      if (generated) {
        insights = generated;
        source = 'anthropic';
      } else {
        insights = buildFallbackInsights(stats);
      }
    } catch (error) {
      console.error('insights_generation_failed', error);
      insights = buildFallbackInsights(stats);
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json({
      insights,
      stats: {
        ...stats,
        source,
      },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('insights_error', error);
    return res.status(500).json({ error: 'insights_query_failed' });
  }
}
