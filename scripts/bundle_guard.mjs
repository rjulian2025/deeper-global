#!/usr/bin/env node

/**
 * Bundle Guard - CI gate for bundle size limits
 * Fails if First Load JS > 86 kB or increases by > 10%
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const BUNDLE_LIMIT_KB = 86
const INCREASE_LIMIT_PERCENT = 10

function parseBundleSize(htmlContent) {
  // Extract First Load JS size from analyze HTML
  const match = htmlContent.match(/First Load JS<\/td>\s*<td[^>]*>([\d.]+)\s*kB/)
  if (!match) {
    throw new Error('Could not parse First Load JS size from bundle analyzer HTML')
  }
  return parseFloat(match[1])
}

function getBaselineSize() {
  try {
    const reportPath = join(process.cwd(), 'docs', 'bundle-report.md')
    if (!existsSync(reportPath)) {
      console.log('⚠️  No baseline bundle report found, using limit as baseline')
      return BUNDLE_LIMIT_KB
    }
    
    const content = readFileSync(reportPath, 'utf8')
    const match = content.match(/First Load JS.*?(\d+(?:\.\d+)?)\s*kB/)
    if (match) {
      return parseFloat(match[1])
    }
    
    console.log('⚠️  Could not parse baseline size, using limit as baseline')
    return BUNDLE_LIMIT_KB
  } catch (error) {
    console.log('⚠️  Error reading baseline, using limit as baseline:', error.message)
    return BUNDLE_LIMIT_KB
  }
}

function main() {
  try {
    // Read the bundle analyzer HTML
    const analyzePath = join(process.cwd(), '.next', 'analyze', 'client.html')
    if (!existsSync(analyzePath)) {
      console.error('❌ Bundle analyzer HTML not found. Run "npm run analyze" first.')
      process.exit(1)
    }
    
    const htmlContent = readFileSync(analyzePath, 'utf8')
    const currentSize = parseBundleSize(htmlContent)
    const baselineSize = getBaselineSize()
    
    console.log(`📊 Bundle Size Analysis:`)
    console.log(`   Current: ${currentSize} kB`)
    console.log(`   Baseline: ${baselineSize} kB`)
    console.log(`   Limit: ${BUNDLE_LIMIT_KB} kB`)
    
    // Check absolute limit
    if (currentSize > BUNDLE_LIMIT_KB) {
      console.error(`❌ Bundle size ${currentSize} kB exceeds limit of ${BUNDLE_LIMIT_KB} kB`)
      process.exit(1)
    }
    
    // Check increase limit
    const increase = ((currentSize - baselineSize) / baselineSize) * 100
    if (increase > INCREASE_LIMIT_PERCENT) {
      console.error(`❌ Bundle size increased by ${increase.toFixed(1)}% (limit: ${INCREASE_LIMIT_PERCENT}%)`)
      process.exit(1)
    }
    
    if (increase > 0) {
      console.log(`⚠️  Bundle size increased by ${increase.toFixed(1)}% (within limit)`)
    } else {
      console.log(`✅ Bundle size decreased by ${Math.abs(increase).toFixed(1)}%`)
    }
    
    console.log(`✅ Bundle size check passed!`)
    
  } catch (error) {
    console.error('❌ Bundle guard failed:', error.message)
    process.exit(1)
  }
}

main()
