#!/usr/bin/env node

// Test the API route for content validation
async function testAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing API Route: /api/ingest\n');
  
  // Test 1: Valid content (no external links)
  console.log('Test 1: Valid content (no external links)');
  try {
    const response1 = await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is anxiety?',
        short_answer: 'Anxiety is a natural response to stress.',
        answer: 'Anxiety is a natural response to stress that can help us stay alert and focused.'
      })
    });
    
    const result1 = await response1.json();
    console.log(`Status: ${response1.status}`);
    console.log(`Response:`, result1);
    console.log('');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('');
  }
  
  // Test 2: Invalid content (with external link)
  console.log('Test 2: Invalid content (with external link)');
  try {
    const response2 = await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is anxiety?',
        short_answer: 'Anxiety is a natural response to stress.',
        answer: 'Anxiety is a natural response to stress. Learn more at https://example.com'
      })
    });
    
    const result2 = await response2.json();
    console.log(`Status: ${response2.status}`);
    console.log(`Response:`, result2);
    console.log('');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('');
  }
  
  // Test 3: Invalid content (with markdown link)
  console.log('Test 3: Invalid content (with markdown link)');
  try {
    const response3 = await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is anxiety?',
        short_answer: 'Anxiety is a natural response to stress.',
        answer: 'Anxiety is a natural response to stress. Learn more [here](https://example.com).'
      })
    });
    
    const result3 = await response3.json();
    console.log(`Status: ${response3.status}`);
    console.log(`Response:`, result3);
    console.log('');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('');
  }
  
  // Test 4: Missing required fields
  console.log('Test 4: Missing required fields');
  try {
    const response4 = await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is anxiety?'
        // Missing short_answer
      })
    });
    
    const result4 = await response4.json();
    console.log(`Status: ${response4.status}`);
    console.log(`Response:`, result4);
    console.log('');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('');
  }
}

// Run tests
testAPI().catch(console.error);
