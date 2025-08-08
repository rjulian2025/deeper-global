#!/usr/bin/env node

/**
 * Link Graph Smoke Test
 * 
 * This script tests the internal linking system to ensure:
 * - Breadcrumbs are present on detail pages
 * - Related questions are present (≥3 links)
 * - Prev/Next navigation is present
 * - Hub pagination is working
 * - Sitemaps are accessible
 */

import { readFileSync } from 'fs'
import { join } from 'path'

const BASE_URL = 'http://localhost:3000'

// Test sample pages
const TEST_PAGES = [
  '/answers',
  '/answers?page=2',
  '/clusters/anxiety',
  '/clusters/anxiety?page=2',
  '/about',
  '/protocol'
]

// Test sample answer pages (these should exist)
const TEST_ANSWERS = [
  '/answers/what-is-anxiety',
  '/answers/how-to-manage-stress',
  '/answers/dealing-with-depression'
]

async function fetchPage(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion failed: ${message}`)
  }
  console.log(`✅ ${message}`)
}

function checkBreadcrumbs(html, expectedItems) {
  // Check for breadcrumb navigation
  assert(html.includes('aria-label="Breadcrumb"'), 'Breadcrumbs navigation present')
  
  // Check for breadcrumb items
  expectedItems.forEach(item => {
    if (item.href) {
      assert(html.includes(`href="${item.href}"`), `Breadcrumb link to ${item.href} present`)
    }
    assert(html.includes(item.label), `Breadcrumb label "${item.label}" present`)
  })
  
  // Check for JSON-LD breadcrumb structured data
  assert(html.includes('"@type": "BreadcrumbList"'), 'Breadcrumb JSON-LD present')
}

function checkRelatedQuestions(html) {
  // Check for related questions section
  assert(html.includes('People Also Ask'), 'Related questions section present')
  
  // Check for at least 3 related question links
  const linkMatches = html.match(/href="\/answers\/[^"]+"/g) || []
  const uniqueLinks = new Set(linkMatches)
  assert(uniqueLinks.size >= 3, `At least 3 related question links present (found ${uniqueLinks.size})`)
  
  // Check for FAQPage JSON-LD
  assert(html.includes('"@type": "FAQPage"'), 'FAQPage JSON-LD present')
}

function checkPrevNextNavigation(html) {
  // Check for prev/next navigation
  assert(html.includes('Previous') || html.includes('Next'), 'Prev/Next navigation present')
  
  // Check for navigation links
  const hasPrevNextLinks = html.includes('href="/answers/') && 
                          (html.includes('Previous') || html.includes('Next'))
  assert(hasPrevNextLinks, 'Prev/Next navigation links present')
}

function checkPagination(html, currentPage) {
  if (currentPage > 1) {
    // Check for pagination component
    assert(html.includes('Previous'), 'Pagination Previous link present')
  }
  
  // Check for page numbers
  assert(html.includes('page='), 'Pagination page links present')
  
  // Check for current page indicator
  assert(html.includes(`bg-blue-600`), 'Current page highlighted in pagination')
}

function checkSitemap(sitemapUrl, expectedUrls) {
  return async () => {
    const sitemap = await fetchPage(sitemapUrl)
    
    // Check it's valid XML
    assert(sitemap.includes('<?xml version="1.0"'), 'Sitemap is valid XML')
    assert(sitemap.includes('<urlset'), 'Sitemap has urlset element')
    
    // Check for expected URLs
    expectedUrls.forEach(url => {
      assert(sitemap.includes(`<loc>${BASE_URL}${url}</loc>`), `Sitemap contains ${url}`)
    })
    
    // Check for lastmod dates
    assert(sitemap.includes('<lastmod>'), 'Sitemap contains lastmod dates')
  }
}

async function runTests() {
  console.log('🧪 Starting Link Graph Smoke Tests...\n')
  
  let testCount = 0
  let passedCount = 0
  
  try {
    // Test 1: Homepage
    console.log('📄 Testing homepage...')
    const homepage = await fetchPage(BASE_URL)
    assert(homepage.includes('Ask Anything'), 'Homepage loads correctly')
    testCount++
    passedCount++
    
    // Test 2: Answers hub page
    console.log('\n📄 Testing answers hub page...')
    const answersPage = await fetchPage(`${BASE_URL}/answers`)
    checkBreadcrumbs(answersPage, [
      { label: 'Home', href: '/' },
      { label: 'Answers' }
    ])
    checkPagination(answersPage, 1)
    testCount++
    passedCount++
    
    // Test 3: Answers hub page 2
    console.log('\n📄 Testing answers hub page 2...')
    const answersPage2 = await fetchPage(`${BASE_URL}/answers?page=2`)
    checkPagination(answersPage2, 2)
    testCount++
    passedCount++
    
    // Test 4: Individual answer page
    console.log('\n📄 Testing individual answer page...')
    const answerPage = await fetchPage(`${BASE_URL}/answers/what-is-anxiety`)
    checkBreadcrumbs(answerPage, [
      { label: 'Home', href: '/' },
      { label: 'Answers', href: '/answers' },
      { label: 'Anxiety' },
      { label: 'What is anxiety?' }
    ])
    checkRelatedQuestions(answerPage)
    checkPrevNextNavigation(answerPage)
    testCount++
    passedCount++
    
    // Test 5: Cluster page
    console.log('\n📄 Testing cluster page...')
    const clusterPage = await fetchPage(`${BASE_URL}/clusters/anxiety`)
    checkBreadcrumbs(clusterPage, [
      { label: 'Home', href: '/' },
      { label: 'Answers', href: '/answers' },
      { label: 'anxiety' }
    ])
    checkPagination(clusterPage, 1)
    testCount++
    passedCount++
    
    // Test 6: Sitemap index
    console.log('\n📄 Testing sitemap index...')
    await checkSitemap(`${BASE_URL}/sitemap.xml`, [
      '/',
      '/answers',
      '/about',
      '/protocol'
    ])()
    testCount++
    passedCount++
    
    // Test 7: Base sitemap
    console.log('\n📄 Testing base sitemap...')
    await checkSitemap(`${BASE_URL}/sitemaps/base.xml`, [
      '/',
      '/answers',
      '/about',
      '/protocol'
    ])()
    testCount++
    passedCount++
    
    // Test 8: Categories sitemap
    console.log('\n📄 Testing categories sitemap...')
    const categoriesSitemap = await fetchPage(`${BASE_URL}/sitemaps/categories.xml`)
    assert(categoriesSitemap.includes('<urlset'), 'Categories sitemap is valid')
    assert(categoriesSitemap.includes('<lastmod>'), 'Categories sitemap has lastmod dates')
    testCount++
    passedCount++
    
    // Test 9: Answers sitemap
    console.log('\n📄 Testing answers sitemap...')
    const answersSitemap = await fetchPage(`${BASE_URL}/sitemaps/answers-1.xml`)
    assert(answersSitemap.includes('<urlset'), 'Answers sitemap is valid')
    assert(answersSitemap.includes('<lastmod>'), 'Answers sitemap has lastmod dates')
    assert(answersSitemap.includes('/answers/'), 'Answers sitemap contains answer URLs')
    testCount++
    passedCount++
    
    console.log(`\n🎉 All tests passed! (${passedCount}/${testCount})`)
    console.log('\n✅ Internal linking system is working correctly:')
    console.log('   - Breadcrumbs present on detail pages')
    console.log('   - Related questions present (≥3 links)')
    console.log('   - Prev/Next navigation present')
    console.log('   - Hub pagination working')
    console.log('   - Sitemaps accessible and valid')
    
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`)
    console.log(`\n📊 Test results: ${passedCount}/${testCount} passed`)
    process.exit(1)
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error)
  process.exit(1)
})
