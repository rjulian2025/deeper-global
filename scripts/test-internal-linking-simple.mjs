#!/usr/bin/env node

// Test the internal linking functionality directly
const CANON = 'https://www.deeper.global';

const TERM_LINKS = {
  "panic attack": "/answers/anxiety/how-to-stop-a-panic-attack",
  "grounding": "/answers/anxiety/what-is-grounding-and-how-to-use-it",
  "burnout": "/answers/work-life/burnout-signs-and-recovery",
  "perfectionism": "/answers/identity/perfectionism-how-to-let-go",
  "people-pleasing": "/answers/work-life/stop-people-pleasing-at-work",
  "emotional numbness": "/answers/depression/emotional-numbness",
  "social anxiety": "/answers/relationships/supporting-social-anxiety",
  "overthinking": "/answers/anxiety/overthinking-before-bed",
  "anxiety": "/answers/anxiety/what-is-anxiety",
  "depression": "/answers/depression/what-is-depression",
  "stress": "/answers/anxiety/managing-stress",
  "therapy": "/answers/therapy/finding-the-right-therapist",
  "meditation": "/answers/mindfulness/meditation-for-beginners",
  "mindfulness": "/answers/mindfulness/what-is-mindfulness",
  "self-care": "/answers/self-care/self-care-practices",
  "boundaries": "/answers/relationships/setting-healthy-boundaries",
  "communication": "/answers/relationships/improving-communication",
  "grief": "/answers/grief/coping-with-loss",
  "trauma": "/answers/trauma/understanding-trauma",
  "self-worth": "/answers/identity/building-self-worth",
  "confidence": "/answers/identity/building-confidence",
  "relationships": "/answers/relationships/healthy-relationships",
  "parenting": "/answers/parenting/parenting-stress",
  "work-life balance": "/answers/work-life/achieving-work-life-balance",
  "sleep": "/answers/sleep/improving-sleep-quality",
  "anger": "/answers/emotions/managing-anger",
  "fear": "/answers/anxiety/understanding-fear",
  "loneliness": "/answers/relationships/coping-with-loneliness",
  "guilt": "/answers/emotions/dealing-with-guilt",
  "shame": "/answers/emotions/overcoming-shame",
  "forgiveness": "/answers/relationships/practicing-forgiveness",
  "gratitude": "/answers/mindfulness/practicing-gratitude",
  "resilience": "/answers/identity/building-resilience",
  "change": "/answers/life-transitions/coping-with-change",
  "identity": "/answers/identity/finding-your-identity",
  "purpose": "/answers/life-transitions/finding-purpose",
  "meaning": "/answers/spirituality/finding-meaning",
  "faith": "/answers/spirituality/faith-and-mental-health",
  "addiction": "/answers/addiction/understanding-addiction",
  "recovery": "/answers/addiction/recovery-journey",
  "healing": "/answers/healing/healing-process",
  "growth": "/answers/personal-growth/personal-growth",
  "transformation": "/answers/personal-growth/personal-transformation"
};

const MAX_LINKS_PER_DOC = 4;

function addInternalLinks(html) {
  if (!html) return html;
  
  let result = html;
  let linkCount = 0;
  
  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = Object.entries(TERM_LINKS)
    .sort(([a], [b]) => b.length - a.length);
  
  for (const [term, path] of sortedTerms) {
    if (linkCount >= MAX_LINKS_PER_DOC) break;
    
    // Create regex to match whole words only, case insensitive
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    // Replace the term with a link, but only if it's not already inside an anchor tag
    result = result.replace(regex, (match, offset, string) => {
      // Check if we're inside an anchor tag
      const beforeText = string.substring(0, offset);
      const afterText = string.substring(offset + match.length);
      
      // Count opening and closing anchor tags before this position
      const beforeOpenTags = (beforeText.match(/<a[^>]*>/g) || []).length;
      const beforeCloseTags = (beforeText.match(/<\/a>/g) || []).length;
      const afterCloseTags = (afterText.match(/<\/a>/g) || []).length;
      
      // If we're inside an anchor tag, don't link
      if (beforeOpenTags > beforeCloseTags) {
        return match;
      }
      
      // If we've reached the link limit, don't link
      if (linkCount >= MAX_LINKS_PER_DOC) {
        return match;
      }
      
      linkCount++;
      return `<a href="${CANON}${path}" class="internal-link">${match}</a>`;
    });
  }
  
  return result;
}

console.log('🧪 Testing Internal Linking System\n');

// Test cases
const testCases = [
  {
    name: 'Basic term linking',
    input: 'Anxiety is a common mental health condition.',
    expected: 'anxiety',
    shouldContain: true
  },
  {
    name: 'Multiple terms',
    input: 'Depression and anxiety often occur together. Stress can make both worse.',
    expected: ['depression', 'anxiety', 'stress'],
    shouldContain: true
  },
  {
    name: 'No matching terms',
    input: 'This is just regular text with no mental health terms.',
    expected: 'anxiety',
    shouldContain: false
  },
  {
    name: 'Case insensitive',
    input: 'ANXIETY and Depression are common.',
    expected: ['anxiety', 'depression'],
    shouldContain: true
  },
  {
    name: 'HTML content',
    input: '<p>Anxiety is a condition that affects many people.</p>',
    expected: 'anxiety',
    shouldContain: true
  },
  {
    name: 'Already linked content',
    input: '<a href="/some-link">Anxiety</a> is a condition.',
    expected: 'anxiety',
    shouldContain: false // Should not double-link
  }
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  console.log(`Testing: ${testCase.name}`);
  
  const result = addInternalLinks(testCase.input);
  
  if (Array.isArray(testCase.expected)) {
    // Multiple terms expected
    const allFound = testCase.expected.every(term => {
      const expectedLink = `${CANON}${TERM_LINKS[term.toLowerCase()]}`;
      return result.includes(`href="${expectedLink}"`);
    });
    
    if (testCase.shouldContain === allFound) {
      console.log(`✅ ${testCase.name}`);
      passed++;
    } else {
      console.log(`❌ ${testCase.name}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Result: "${result}"`);
      console.log(`   Expected: ${testCase.shouldContain ? 'to contain' : 'not to contain'} links`);
      console.log('');
      failed++;
    }
  } else {
    // Single term expected
    const expectedLink = `${CANON}${TERM_LINKS[testCase.expected.toLowerCase()]}`;
    const containsLink = result.includes(`href="${expectedLink}"`);
    
    if (testCase.shouldContain === containsLink) {
      console.log(`✅ ${testCase.name}`);
      passed++;
    } else {
      console.log(`❌ ${testCase.name}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Result: "${result}"`);
      console.log(`   Expected: ${testCase.shouldContain ? 'to contain' : 'not to contain'} link to ${expectedLink}`);
      console.log('');
      failed++;
    }
  }
}

// Test link count limit
console.log('\n🔍 Testing Link Count Limit\n');

const longContent = 'Anxiety and depression are common. Stress affects many people. Therapy can help. Mindfulness is beneficial.';
const result = addInternalLinks(longContent);

// Count the number of internal links
const linkCount = (result.match(/href="https:\/\/www\.deeper\.global\/answers/g) || []).length;

if (linkCount <= 4) {
  console.log(`✅ Link count limit respected: ${linkCount} links (max 4)`);
  passed++;
} else {
  console.log(`❌ Link count limit exceeded: ${linkCount} links (max 4)`);
  failed++;
}

// Test term priority (longer terms first)
console.log('\n🔍 Testing Term Priority\n');

const priorityTest = 'People-pleasing behavior can be harmful.';
const priorityResult = addInternalLinks(priorityTest);

// Should link "people-pleasing" not just "people" or "pleasing"
if (priorityResult.includes('people-pleasing') && !priorityResult.includes('people"') && !priorityResult.includes('pleasing"')) {
  console.log('✅ Longer terms prioritized correctly');
  passed++;
} else {
  console.log('❌ Term priority not working correctly');
  console.log(`   Result: "${priorityResult}"`);
  failed++;
}

// Summary
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('💥 Some tests failed!');
  process.exit(1);
}
