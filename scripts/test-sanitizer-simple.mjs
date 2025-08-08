#!/usr/bin/env node

// Test the sanitizer logic directly
function stripExternalLinks(html, allowDeeperOnly = false) {
  if (!html) return html;

  // 1) Replace markdown links [text](url) with plain text
  let out = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, '$1');

  // 2) Replace HTML anchors with their inner text
  out = out.replace(/<a[^>]*>(.*?)<\/a>/gis, '$1');

  // 3) Remove bare URLs
  out = out.replace(/https?:\/\/[^\s)]+/gi, '');

  if (allowDeeperOnly) {
    // If we ever pass allowDeeperOnly=true, we'll keep deeper.global and strip others.
    // Re-add deeper.global links by detecting the pattern we just removed (skip for now).
  }
  return out;
}

const containsExternalUrl = (s) => /(https?:\/\/|www\.)/i.test(s || '');

// Test cases
const testCases = [
  {
    name: 'Markdown links',
    input: 'Check out [this article](https://example.com) for more info',
    expected: 'Check out this article for more info'
  },
  {
    name: 'HTML anchors',
    input: 'Visit <a href="https://example.com">this site</a> for details',
    expected: 'Visit this site for details'
  },
  {
    name: 'Bare URLs',
    input: 'Go to https://example.com for more information',
    expected: 'Go to  for more information'
  },
  {
    name: 'Mixed content',
    input: 'Read [this](https://example.com) and visit <a href="https://test.com">here</a> or go to https://demo.com',
    expected: 'Read this and visit here or go to '
  },
  {
    name: 'No links',
    input: 'This is just plain text with no links',
    expected: 'This is just plain text with no links'
  },
  {
    name: 'Empty string',
    input: '',
    expected: ''
  }
];

// Test the sanitizer
console.log('🧪 Testing External Link Sanitizer\n');

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const result = stripExternalLinks(testCase.input);
  const success = result === testCase.expected;
  
  if (success) {
    console.log(`✅ ${testCase.name}`);
    passed++;
  } else {
    console.log(`❌ ${testCase.name}`);
    console.log(`   Input:    "${testCase.input}"`);
    console.log(`   Expected:  "${testCase.expected}"`);
    console.log(`   Got:       "${result}"`);
    console.log('');
    failed++;
  }
}

// Test URL detection
console.log('\n🔍 Testing URL Detection\n');

const urlTestCases = [
  { input: 'https://example.com', expected: true },
  { input: 'http://test.com', expected: true },
  { input: 'www.example.com', expected: true },
  { input: 'Just plain text', expected: false },
  { input: '', expected: false },
  { input: null, expected: false }
];

for (const testCase of urlTestCases) {
  const result = containsExternalUrl(testCase.input);
  const success = result === testCase.expected;
  
  if (success) {
    console.log(`✅ "${testCase.input}" -> ${result}`);
    passed++;
  } else {
    console.log(`❌ "${testCase.input}" -> expected ${testCase.expected}, got ${result}`);
    failed++;
  }
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
