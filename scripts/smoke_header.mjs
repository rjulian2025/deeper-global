#!/usr/bin/env node

/**
 * Smoke test for header presence across key pages
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

function assertHeaderPresent(html, pageName) {
  // Check for "Deeper" logo link - more flexible pattern
  const deeperLogoPattern = /<a[^>]*href="\/"[^>]*>.*?Deeper.*?<\/a>/i;
  if (!deeperLogoPattern.test(html)) {
    throw new Error(`"Deeper" logo link not found on ${pageName}`);
  }
  
  // Check for navigation links - more flexible patterns
  const navLinks = [
    { href: '/answers', text: 'Browse' },
    { href: '/protocol', text: 'Protocol' },
    { href: '/about', text: 'About' }
  ];
  
  for (const link of navLinks) {
    // More flexible pattern that matches the actual HTML structure
    const linkPattern = new RegExp(`<a[^>]*href="${link.href}"[^>]*>.*?${link.text}.*?<\/a>`, 'i');
    if (!linkPattern.test(html)) {
      throw new Error(`Navigation link "${link.text}" (${link.href}) not found on ${pageName}`);
    }
  }
  
  console.log(`✅ ${pageName}: Header with logo and navigation links found`);
}

async function runSmokeTest() {
  console.log('🚀 Starting header smoke test...\n');
  
  const testPages = [
    { url: '/', name: 'Homepage' },
    { url: '/answers', name: 'Answers page' },
    { url: '/about', name: 'About page' },
    { url: '/protocol', name: 'Protocol page' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const page of testPages) {
    try {
      const html = await fetchPage(`${BASE_URL}${page.url}`);
      assertHeaderPresent(html, page.name);
      passed++;
    } catch (error) {
      console.error(`❌ ${page.name}: ${error.message}`);
      failed++;
    }
  }
  
  // Test a dynamic answer page if available
  try {
    const answersHtml = await fetchPage(`${BASE_URL}/answers`);
    // Extract first answer slug from the answers page
    const slugMatch = answersHtml.match(/href="\/answers\/([^"]+)"/);
    if (slugMatch) {
      const answerSlug = slugMatch[1];
      const answerHtml = await fetchPage(`${BASE_URL}/answers/${answerSlug}`);
      assertHeaderPresent(answerHtml, `Answer page (${answerSlug})`);
      passed++;
    } else {
      console.log('⚠️  No answer slugs found to test dynamic page');
    }
  } catch (error) {
    console.error(`❌ Dynamic answer page: ${error.message}`);
    failed++;
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n❌ Smoke test FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Smoke test PASSED');
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

runSmokeTest();
