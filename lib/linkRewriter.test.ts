// Test file for link rewriting functionality
import { rewriteLinks, categoryMap, shouldRewriteLink } from './linkRewriter'

// Test cases for link rewriting
const testCases = [
  {
    name: 'Anxiety disorder link',
    input: '<a href="https://en.wikipedia.org/wiki/Anxiety_disorder">Anxiety disorder</a>',
    expected: '<a href="/categories/Anxiety%20%26%20Stress" class="internal-link">Anxiety disorder</a>'
  },
  {
    name: 'Depression link',
    input: '<a href="https://en.wikipedia.org/wiki/Major_depressive_disorder">Major depressive disorder</a>',
    expected: '<a href="/categories/Depression" class="internal-link">Major depressive disorder</a>'
  },
  {
    name: 'Grief link',
    input: '<a href="https://en.wikipedia.org/wiki/Grief">Grief</a>',
    expected: '<a href="/categories/Grief%20%26%20Loss" class="internal-link">Grief</a>'
  },
  {
    name: 'Therapy link',
    input: '<a href="https://en.wikipedia.org/wiki/Psychotherapy">Psychotherapy</a>',
    expected: '<a href="/categories/Therapy%20%26%20Mental%20Health" class="internal-link">Psychotherapy</a>'
  },
  {
    name: 'Unknown Wikipedia link should remain unchanged',
    input: '<a href="https://en.wikipedia.org/wiki/Quantum_physics">Quantum physics</a>',
    expected: '<a href="https://en.wikipedia.org/wiki/Quantum_physics">Quantum physics</a>'
  },
  {
    name: 'Non-Wikipedia link should remain unchanged',
    input: '<a href="https://example.com">Example</a>',
    expected: '<a href="https://example.com">Example</a>'
  }
]

// Run tests
export function runLinkRewriterTests() {
  console.log('🧪 Running link rewriter tests...\n')
  
  let passed = 0
  let failed = 0
  
  testCases.forEach(testCase => {
    const result = rewriteLinks(testCase.input)
    const success = result === testCase.expected
    
    if (success) {
      console.log(`✅ ${testCase.name}`)
      passed++
    } else {
      console.log(`❌ ${testCase.name}`)
      console.log(`   Expected: ${testCase.expected}`)
      console.log(`   Got:      ${result}`)
      failed++
    }
  })
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed')
  }
  
  return { passed, failed }
}

// Test category mapping
export function testCategoryMapping() {
  console.log('\n🗺️  Testing category mapping...\n')
  
  const testMappings = [
    { term: 'Anxiety disorder', expected: '/categories/Anxiety%20%26%20Stress' },
    { term: 'Depression', expected: '/categories/Depression' },
    { term: 'Grief', expected: '/categories/Grief%20%26%20Loss' },
    { term: 'Therapy', expected: '/categories/Therapy%20%26%20Mental%20Health' }
  ]
  
  testMappings.forEach(({ term, expected }) => {
    const actual = categoryMap[term]
    if (actual === expected) {
      console.log(`✅ "${term}" → "${actual}"`)
    } else {
      console.log(`❌ "${term}" → expected "${expected}", got "${actual}"`)
    }
  })
}

// Test shouldRewriteLink function
export function testShouldRewriteLink() {
  console.log('\n🔍 Testing shouldRewriteLink function...\n')
  
  const testCases = [
    {
      url: 'https://en.wikipedia.org/wiki/Anxiety_disorder',
      text: 'Anxiety disorder',
      shouldRewrite: true
    },
    {
      url: 'https://en.wikipedia.org/wiki/Quantum_physics',
      text: 'Quantum physics',
      shouldRewrite: false
    },
    {
      url: 'https://example.com',
      text: 'Example',
      shouldRewrite: false
    }
  ]
  
  testCases.forEach(testCase => {
    const result = shouldRewriteLink(testCase.url, testCase.text)
    const success = (result !== null) === testCase.shouldRewrite
    
    if (success) {
      console.log(`✅ ${testCase.text} (${testCase.shouldRewrite ? 'should' : 'should not'} rewrite)`)
    } else {
      console.log(`❌ ${testCase.text} (expected ${testCase.shouldRewrite ? 'should' : 'should not'} rewrite, got ${result !== null ? 'should' : 'should not'})`)
    }
  })
}

// Run all tests if this file is executed directly
if (typeof window === 'undefined') {
  runLinkRewriterTests()
  testCategoryMapping()
  testShouldRewriteLink()
}
