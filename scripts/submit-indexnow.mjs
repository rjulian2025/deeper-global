const HOST = 'www.deeper.global';
const KEY = '3ba9ef76-3c68-49af-aefb-ffa306c3569a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const defaultUrls = [
  'https://www.deeper.global/developers/',
  'https://www.deeper.global/openapi.json',
  'https://www.deeper.global/agents.txt',
  'https://www.deeper.global/llms.txt',
  'https://www.deeper.global/llms/answers.json',
  'https://www.deeper.global/llms/entities.json',
  'https://www.deeper.global/llms/priority.json',
];

function parseUrls() {
  const argIndex = process.argv.indexOf('--urls');
  if (argIndex === -1) return defaultUrls;

  const value = process.argv[argIndex + 1] ?? '';
  return value
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
}

async function main() {
  const urlList = parseUrls();
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  const text = await response.text();
  const result = {
    endpoint: ENDPOINT,
    status: response.status,
    ok: response.ok,
    submitted_count: urlList.length,
    keyLocation: KEY_LOCATION,
    response: text,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!response.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
