# Performance Optimization Checklist - Sprint 01

**Date:** $(date)
**Branch:** opt/sprint-01
**Target:** Reduce First Load JS by ≥15% (from 101 kB to ≤86 kB)

## ✅ Completed Optimizations

### A) Build Hygiene
- [x] **TypeScript Strict Mode**: Enabled `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- [x] **ESLint**: Configured with `no-unused-vars/imports` and `react-hooks/exhaustive-deps`
- [x] **Bundle Analyzer**: Added `@next/bundle-analyzer` with `npm run analyze` script
- [x] **CI Build**: Added `build:ci` script with telemetry disabled

### B) Client/Server Split
- [x] **Server Components**: All app components remain server-side (no accidental `use client`)
- [x] **Client Islands**: Only analytics components use `'use client'` (GoogleAnalytics, WebVitals)
- [x] **Component Audit**: QuestionCard and all page components are server-rendered

### C) Tailwind & CSS
- [x] **Content Globs**: Tailwind only scans app code (`./app/**/*`, `./components/**/*`)
- [x] **Font Optimization**: Removed duplicate Inter font import, using custom font only
- [x] **CSS Cleanup**: No unused global CSS, all styles are Tailwind utilities or custom components

### D) Supabase Optimization
- [x] **Column-Scoped Queries**: Created `lib/db.ts` with optimized field selection
- [x] **Caching Strategy**: All queries wrapped with `unstable_cache` and proper tags
- [x] **Pagination**: Implemented `getQuestions({ limit, offset, category })`
- [x] **Database Indexes**: Documented required indexes in `docs/db-indexes.sql`

### E) Rendering/ISR
- [x] **Revalidation**: All pages have `export const revalidate = 3600`
- [x] **Suspense Boundaries**: Added progressive loading for large lists
- [x] **Cache Tags**: Proper cache invalidation with `revalidateTag`

### F) Headers/Ops
- [x] **Security Headers**: Added X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- [x] **Cache Headers**: Static assets cached for 1 year with immutable
- [x] **Smoke Tests**: Created `scripts/deploy_smoke.sh` for deployment verification

## 📊 Performance Measurements

### Before (Baseline)
- **First Load JS:** 101 kB
- **Shared JS:** 87.2 kB
- **Framework:** 31.6 kB
- **Supabase:** 53.6 kB

### After (Target)
- **First Load JS:** ≤86 kB (≥15% reduction)
- **Bundle Analysis:** Run `npm run analyze` to verify
- **Build Output:** No "deopted into client rendering" warnings

## 🔧 Verification Steps

### 1. Build Verification
```bash
npm run build:ci
# Check for:
# - No TypeScript errors
# - No "deopted into client rendering" warnings
# - First Load JS ≤86 kB
```

### 2. Bundle Analysis
```bash
npm run analyze
# Open .next/analyze/client.html
# Verify bundle size reduction
```

### 3. Production Smoke Test
```bash
npm run smoke
# Verify all endpoints return 200
# Verify CSS loads correctly
```

### 4. Database Performance
```sql
-- Run indexes from docs/db-indexes.sql
-- Verify query performance with EXPLAIN ANALYZE
```

## 🚀 Deployment Checklist

- [ ] Run `npm run build:ci` locally
- [ ] Run `npm run smoke` against staging
- [ ] Deploy to production with `vercel --prod`
- [ ] Run `npm run smoke` against production
- [ ] Monitor Core Web Vitals in GA4

## 📈 Success Criteria

- [ ] **First Load JS ≤86 kB** (≥15% reduction from 101 kB)
- [ ] **No client rendering warnings** in build output
- [ ] **All smoke tests pass** in production
- [ ] **TypeScript strict mode** passes without errors
- [ ] **Database queries optimized** with column-scoped selection

## 🔄 Next Sprint Ideas

- **Code Splitting**: Lazy load non-critical components
- **Image Optimization**: Implement Next.js Image component
- **Service Worker**: Add offline caching
- **CDN Optimization**: Configure edge caching
- **Monitoring**: Add performance monitoring
