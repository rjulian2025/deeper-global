#!/bin/bash

# DANGER – requires my confirmation
# Deeper Workspace Cleanup Script
# 
# This script will perform cleanup actions based on the audit findings.
# READ THE AUDIT REPORT FIRST: .local-audit/audit-report.md
#
# WARNING: This script can delete files and directories.
# Make sure you have backups of any important work.
#
# To proceed, you must explicitly confirm by setting CONFIRM_CLEANUP=true
# and choosing a cleanup plan (PLAN_A, PLAN_B, or PLAN_C)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Safety check - must be explicitly set to true
if [ "${CONFIRM_CLEANUP:-false}" != "true" ]; then
    echo -e "${RED}❌ SAFETY CHECK FAILED${NC}"
    echo ""
    echo "This script requires explicit confirmation to run."
    echo "To proceed, set CONFIRM_CLEANUP=true and choose a plan:"
    echo ""
    echo "  PLAN_A=true ./scripts/clean_workspace.sh  # Archive & Clean (Safest)"
    echo "  PLAN_B=true ./scripts/clean_workspace.sh  # Focused Clean Only"
    echo "  PLAN_C=true ./scripts/clean_workspace.sh  # Minimal Process Only"
    echo ""
    echo "Example:"
    echo "  CONFIRM_CLEANUP=true PLAN_A=true ./scripts/clean_workspace.sh"
    echo ""
    echo "⚠️  READ THE AUDIT REPORT FIRST: .local-audit/audit-report.md"
    exit 1
fi

# Check which plan is selected
if [ "${PLAN_A:-false}" = "true" ]; then
    PLAN="A"
elif [ "${PLAN_B:-false}" = "true" ]; then
    PLAN="B"
elif [ "${PLAN_C:-false}" = "true" ]; then
    PLAN="C"
else
    echo -e "${RED}❌ NO PLAN SELECTED${NC}"
    echo "Please choose a cleanup plan:"
    echo "  PLAN_A=true  # Archive & Clean (Safest)"
    echo "  PLAN_B=true  # Focused Clean Only"
    echo "  PLAN_C=true  # Minimal Process Only"
    exit 1
fi

echo -e "${RED}⚠️  DANGER - CLEANUP SCRIPT ACTIVATED${NC}"
echo "Plan: $PLAN"
echo "Active Project: $(pwd)"
echo ""

# Create backup directory for Plan A
if [ "$PLAN" = "A" ]; then
    ARCHIVE_DIR="$HOME/Archives/deeper-$(date +%Y%m%d)"
    echo -e "${YELLOW}📦 Creating archive directory: $ARCHIVE_DIR${NC}"
    mkdir -p "$ARCHIVE_DIR"
fi

# Function to safely remove directory
safe_remove() {
    local path="$1"
    local reason="$2"
    
    if [ -e "$path" ]; then
        echo -e "${YELLOW}🗑️  Removing: $path ($reason)${NC}"
        rm -rf "$path"
        echo -e "${GREEN}✅ Removed: $path${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipping (not found): $path${NC}"
    fi
}

# Function to safely archive directory
safe_archive() {
    local source="$1"
    local reason="$2"
    
    if [ -e "$source" ]; then
        local basename=$(basename "$source")
        local archive_path="$ARCHIVE_DIR/$basename"
        
        echo -e "${YELLOW}📦 Archiving: $source -> $archive_path ($reason)${NC}"
        
        # Create archive
        tar -czf "$archive_path.tar.gz" -C "$(dirname "$source")" "$basename"
        
        # Remove build caches from archived copy
        if [ -d "$source/.next" ]; then
            echo -e "${YELLOW}🗑️  Removing .next from archived copy${NC}"
            rm -rf "$source/.next"
        fi
        
        if [ -d "$source/.turbo" ]; then
            echo -e "${YELLOW}🗑️  Removing .turbo from archived copy${NC}"
            rm -rf "$source/.turbo"
        fi
        
        if [ -d "$source/node_modules" ]; then
            echo -e "${YELLOW}🗑️  Removing node_modules from archived copy${NC}"
            rm -rf "$source/node_modules"
        fi
        
        # Remove original after archiving
        rm -rf "$source"
        
        echo -e "${GREEN}✅ Archived and cleaned: $source${NC}"
    else
        echo -e "${BLUE}ℹ️  Skipping (not found): $source${NC}"
    fi
}

# Function to stop process
stop_process() {
    local pid="$1"
    local reason="$2"
    
    if kill -0 "$pid" 2>/dev/null; then
        echo -e "${YELLOW}🛑 Stopping process $pid ($reason)${NC}"
        kill "$pid"
        echo -e "${GREEN}✅ Stopped process $pid${NC}"
    else
        echo -e "${BLUE}ℹ️  Process $pid already stopped${NC}"
    fi
}

echo -e "${BLUE}🚀 Starting cleanup (Plan $PLAN)...${NC}"
echo ""

# Plan A: Archive & Clean (Safest)
if [ "$PLAN" = "A" ]; then
    echo -e "${YELLOW}📦 Plan A: Archive & Clean${NC}"
    echo ""
    
    # Archive old project copies
    echo -e "${BLUE}📦 Archiving old project copies...${NC}"
    safe_archive "/Users/rickjulian/deeper2-vite-mistake" "Old project copy"
    safe_archive "/Users/rickjulian/deeper2" "Parent directory with conflicts"
    
    # Remove conflicting parent lockfiles
    echo -e "${BLUE}🗑️  Removing conflicting parent lockfiles...${NC}"
    safe_remove "/Users/rickjulian/deeper2/.env.local" "Environment file in parent directory"
    
    # Stop running processes
    echo -e "${BLUE}🛑 Stopping running processes...${NC}"
    port_3000_pids=$(lsof -ti:3000 2>/dev/null || echo "")
    for pid in $port_3000_pids; do
        stop_process "$pid" "Using port 3000"
    done
    
    next_dev_pids=$(pgrep -f "next dev" 2>/dev/null || echo "")
    for pid in $next_dev_pids; do
        stop_process "$pid" "Next.js dev server"
    done

# Plan B: Focused Clean Only
elif [ "$PLAN" = "B" ]; then
    echo -e "${YELLOW}🧹 Plan B: Focused Clean Only${NC}"
    echo ""
    
    # Remove conflicting parent lockfiles
    echo -e "${BLUE}🗑️  Removing conflicting parent lockfiles...${NC}"
    safe_remove "/Users/rickjulian/deeper2/.env.local" "Environment file in parent directory"
    
    # Clean build caches in non-active projects
    echo -e "${BLUE}🗑️  Cleaning build caches in non-active projects...${NC}"
    safe_remove "/Users/rickjulian/deeper2-vite-mistake/.next" "Build cache"
    safe_remove "/Users/rickjulian/deeper2-vite-mistake/.turbo" "Build cache"
    safe_remove "/Users/rickjulian/deeper2-vite-mistake/node_modules" "Dependencies"
    
    safe_remove "/Users/rickjulian/deeper2/.next" "Build cache"
    safe_remove "/Users/rickjulian/deeper2/.turbo" "Build cache"
    safe_remove "/Users/rickjulian/deeper2/node_modules" "Dependencies"
    
    # Stop conflicting development servers
    echo -e "${BLUE}🛑 Stopping conflicting development servers...${NC}"
    port_3000_pids=$(lsof -ti:3000 2>/dev/null || echo "")
    for pid in $port_3000_pids; do
        stop_process "$pid" "Using port 3000"
    done
    
    next_dev_pids=$(pgrep -f "next dev" 2>/dev/null || echo "")
    for pid in $next_dev_pids; do
        stop_process "$pid" "Next.js dev server"
    done

# Plan C: Minimal Process Only
elif [ "$PLAN" = "C" ]; then
    echo -e "${YELLOW}⚡ Plan C: Minimal Process Only${NC}"
    echo ""
    
    # Stop all Next.js development servers
    echo -e "${BLUE}🛑 Stopping all Next.js development servers...${NC}"
    port_3000_pids=$(lsof -ti:3000 2>/dev/null || echo "")
    for pid in $port_3000_pids; do
        stop_process "$pid" "Using port 3000"
    done
    
    next_dev_pids=$(pgrep -f "next dev" 2>/dev/null || echo "")
    for pid in $next_dev_pids; do
        stop_process "$pid" "Next.js dev server"
    done
    
    # Remove only .next directories in non-active projects
    echo -e "${BLUE}🗑️  Removing .next directories in non-active projects...${NC}"
    safe_remove "/Users/rickjulian/deeper2-vite-mistake/.next" "Build cache"
    safe_remove "/Users/rickjulian/deeper2/.next" "Build cache"
fi

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""

# Summary
if [ "$PLAN" = "A" ]; then
    echo -e "${BLUE}📋 Summary (Plan A):${NC}"
    echo "  ✅ Archived old project copies to $ARCHIVE_DIR"
    echo "  ✅ Removed conflicting parent lockfiles"
    echo "  ✅ Stopped running processes"
    echo ""
    echo "Archived projects can be restored from: $ARCHIVE_DIR"
elif [ "$PLAN" = "B" ]; then
    echo -e "${BLUE}📋 Summary (Plan B):${NC}"
    echo "  ✅ Removed conflicting parent lockfiles"
    echo "  ✅ Cleaned build caches in non-active projects"
    echo "  ✅ Stopped conflicting development servers"
elif [ "$PLAN" = "C" ]; then
    echo -e "${BLUE}📋 Summary (Plan C):${NC}"
    echo "  ✅ Stopped all Next.js development servers"
    echo "  ✅ Removed .next directories in non-active projects"
fi

echo ""
echo -e "${YELLOW}🔍 Next steps:${NC}"
echo "1. Run the audit script again to verify cleanup: ./scripts/audit_workspace.sh"
echo "2. Test your active project: npm run dev"
echo "3. If needed, restore from archives (Plan A only): $ARCHIVE_DIR"

echo ""
echo -e "${GREEN}🎉 Workspace cleanup completed successfully!${NC}"


