#!/usr/bin/env node

// Test the internal linking functionality
import { addInternalLinks } from '../lib/internalLinker.ts';
import { TERM_LINKS, CANON } from '../lib/internalLinkPolicy.ts';

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
