#!/bin/bash

# Deploy Smoke Test for Deeper 2
# Verifies production deployment is working correctly

set -e

BASE_URL="${1:-https://www.deeper.global}"
echo "🔍 Testing deployment at: $BASE_URL"

# Test homepage
echo "📄 Testing homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Homepage: $HTTP_CODE"
else
    echo "❌ Homepage: $HTTP_CODE"
    exit 1
fi

# Test answers page
echo "📄 Testing answers page..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/answers")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Answers page: $HTTP_CODE"
else
    echo "❌ Answers page: $HTTP_CODE"
    exit 1
fi

# Test CSS loading
echo "🎨 Testing CSS loading..."
CSS_URL=$(curl -s "$BASE_URL/answers" | grep -o '/_next/static/css/[^"]*\.css' | head -1)
if [ -n "$CSS_URL" ]; then
    echo "✅ CSS URL found: $CSS_URL"
    CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$CSS_URL")
    if [ "$CSS_CODE" = "200" ]; then
        echo "✅ CSS loads: $CSS_CODE"
    else
        echo "❌ CSS fails: $CSS_CODE"
        exit 1
    fi
else
    echo "❌ No CSS URL found"
    exit 1
fi

# Test a known answer page (if we have one)
echo "📄 Testing answer detail page..."
# Try to find a slug from the answers page
SLUG=$(curl -s "$BASE_URL/answers" | grep -o 'href="/answers/[^"]*"' | head -1 | sed 's/href="\/answers\///' | sed 's/"//')
if [ -n "$SLUG" ]; then
    echo "🔗 Testing slug: $SLUG"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/answers/$SLUG")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Answer detail: $HTTP_CODE"
    else
        echo "❌ Answer detail: $HTTP_CODE"
        exit 1
    fi
else
    echo "⚠️  No answer slugs found to test"
fi

# Test static assets
echo "📦 Testing static assets..."
# Get actual chunk URL from the page
CHUNK_URL=$(curl -s "$BASE_URL/answers" | grep -o '/_next/static/chunks/[^"]*\.js' | head -1)
if [ -n "$CHUNK_URL" ]; then
    echo "✅ Chunk URL found: $CHUNK_URL"
    STATIC_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$CHUNK_URL")
    if [ "$STATIC_CODE" = "200" ]; then
        echo "✅ Static assets: $STATIC_CODE"
    else
        echo "❌ Static assets: $STATIC_CODE"
        exit 1
    fi
else
    echo "❌ No chunk URL found"
    exit 1
fi

echo ""
echo "🎉 All smoke tests passed!"
echo "✅ Deployment is healthy at $BASE_URL"
