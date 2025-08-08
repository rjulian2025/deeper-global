#!/bin/bash

# Deeper Workspace Audit Script
# READ-ONLY - No destructive actions
# Outputs to console and creates audit report

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create audit directory
AUDIT_DIR="$(pwd)/.local-audit"
mkdir -p "$AUDIT_DIR"
REPORT_FILE="$AUDIT_DIR/audit-report.md"

echo -e "${BLUE}🔍 Starting Deeper Workspace Audit...${NC}"
echo "Report will be saved to: $REPORT_FILE"
echo ""

# Initialize report
cat > "$REPORT_FILE" << 'EOF'
# Deeper Workspace Audit Report

**Generated:** $(date)
**Audit Script:** scripts/audit_workspace.sh
**Active Project:** $(pwd)

## Project Inventory

| Path | Git Remote | Branch | Latest Commit | Next.js | Package.json | Build Caches | Conflicts |
|------|------------|--------|---------------|---------|--------------|--------------|-----------|
EOF

# Function to check if directory is a git repo
is_git_repo() {
    local dir="$1"
    if [ -d "$dir/.git" ]; then
        return 0
    else
        return 1
    fi
}

# Function to get git info
get_git_info() {
    local dir="$1"
    if is_git_repo "$dir"; then
        cd "$dir"
        local remote=$(git remote -v 2>/dev/null | head -1 | awk '{print $2}' || echo "No remote")
        local branch=$(git branch --show-current 2>/dev/null || echo "No branch")
        local commit=$(git log -1 --oneline 2>/dev/null || echo "No commits")
        echo "$remote|$branch|$commit"
        cd - > /dev/null
    else
        echo "Not a git repo|N/A|N/A"
    fi
}

# Function to check Next.js indicators
check_nextjs() {
    local dir="$1"
    local indicators=0
    [ -d "$dir/app" ] && indicators=$((indicators + 1))
    [ -d "$dir/src/app" ] && indicators=$((indicators + 1))
    [ -f "$dir/next.config.js" ] && indicators=$((indicators + 1))
    [ -f "$dir/next.config.mjs" ] && indicators=$((indicators + 1))
    [ -f "$dir/next.config.ts" ] && indicators=$((indicators + 1))
    if [ $indicators -gt 0 ]; then
        echo "✅ ($indicators indicators)"
    else
        echo "❌"
    fi
}

# Function to check build caches
check_build_caches() {
    local dir="$1"
    local caches=""
    [ -d "$dir/.next" ] && caches="$caches .next"
    [ -d "$dir/.turbo" ] && caches="$caches .turbo"
    [ -d "$dir/node_modules" ] && caches="$caches node_modules"
    if [ -n "$caches" ]; then
        echo "✅ ($caches)"
    else
        echo "❌"
    fi
}

# Function to check for conflicts
check_conflicts() {
    local dir="$1"
    local conflicts=""
    
    # Check for duplicate app directories
    if [ -d "$dir/app" ] && [ -d "$dir/src/app" ]; then
        conflicts="$conflicts duplicate-app-dirs"
    fi
    
    # Check for multiple robots files
    local robots_count=0
    [ -f "$dir/public/robots.txt" ] && robots_count=$((robots_count + 1))
    [ -f "$dir/app/robots.ts" ] && robots_count=$((robots_count + 1))
    [ -f "$dir/app/robots.js" ] && robots_count=$((robots_count + 1))
    [ -f "$dir/src/app/robots.ts" ] && robots_count=$((robots_count + 1))
    [ -f "$dir/src/app/robots.js" ] && robots_count=$((robots_count + 1))
    if [ $robots_count -gt 1 ]; then
        conflicts="$conflicts multiple-robots"
    fi
    
    # Check for multiple next.config files
    local config_count=0
    [ -f "$dir/next.config.js" ] && config_count=$((config_count + 1))
    [ -f "$dir/next.config.mjs" ] && config_count=$((config_count + 1))
    [ -f "$dir/next.config.ts" ] && config_count=$((config_count + 1))
    if [ $config_count -gt 1 ]; then
        conflicts="$conflicts multiple-next-configs"
    fi
    
    # Check for multiple tsconfig files
    local tsconfig_count=0
    [ -f "$dir/tsconfig.json" ] && tsconfig_count=$((tsconfig_count + 1))
    [ -f "$dir/tsconfig.base.json" ] && tsconfig_count=$((tsconfig_count + 1))
    [ -f "$dir/tsconfig.app.json" ] && tsconfig_count=$((tsconfig_count + 1))
    if [ $tsconfig_count -gt 1 ]; then
        conflicts="$conflicts multiple-tsconfigs"
    fi
    
    if [ -n "$conflicts" ]; then
        echo "⚠️ ($conflicts)"
    else
        echo "✅"
    fi
}

# Search for Deeper projects
echo -e "${YELLOW}🔍 Searching for Deeper projects...${NC}"

# Search paths
SEARCH_PATHS=("$HOME" "$HOME/deeper2" "$HOME/Desktop" "$HOME/Projects")

for search_path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$search_path" ]; then
        echo "Searching in: $search_path"
        
        # Find directories matching deeper patterns
        while IFS= read -r -d '' dir; do
            if [ -d "$dir" ]; then
                echo -e "${BLUE}Found: $dir${NC}"
                
                # Get git info
                git_info=$(get_git_info "$dir")
                remote=$(echo "$git_info" | cut -d'|' -f1)
                branch=$(echo "$git_info" | cut -d'|' -f2)
                commit=$(echo "$git_info" | cut -d'|' -f3)
                
                # Check indicators
                has_package_json="❌"
                [ -f "$dir/package.json" ] && has_package_json="✅"
                
                nextjs_status=$(check_nextjs "$dir")
                build_caches=$(check_build_caches "$dir")
                conflicts=$(check_conflicts "$dir")
                
                # Add to report
                echo "| \`$dir\` | \`$remote\` | \`$branch\` | \`$commit\` | $nextjs_status | $has_package_json | $build_caches | $conflicts |" >> "$REPORT_FILE"
                
            fi
        done < <(find "$search_path" -maxdepth 3 -type d \( -name "*deeper*" -o -name "*deeper-global*" \) -print0 2>/dev/null || true)
    fi
done

# Check parent lockfile conflicts
echo -e "${YELLOW}🔍 Checking parent lockfile conflicts...${NC}"

cat >> "$REPORT_FILE" << 'EOF'

## Parent Lockfile Conflicts

Starting from active project root, checking upwards for conflicting lockfiles:

| Path | File | Status |
|------|------|--------|
EOF

current_dir="$(pwd)"
while [ "$current_dir" != "$HOME" ] && [ "$current_dir" != "/" ]; do
    for lockfile in package-lock.json pnpm-lock.yaml yarn.lock .npmrc .nvmrc; do
        if [ -f "$current_dir/$lockfile" ]; then
            status="⚠️ Potential conflict"
            if [ "$current_dir" = "$(pwd)" ]; then
                status="✅ Active project"
            fi
            echo "| \`$current_dir\` | \`$lockfile\` | $status |" >> "$REPORT_FILE"
        fi
    done
    
    # Check for .env files
    for envfile in .env .env.local .env.development .env.production; do
        if [ -f "$current_dir/$envfile" ]; then
            status="⚠️ Environment file"
            if [ "$current_dir" = "$(pwd)" ]; then
                status="✅ Active project"
            fi
            echo "| \`$current_dir\` | \`$envfile\` | $status |" >> "$REPORT_FILE"
        fi
    done
    
    current_dir=$(dirname "$current_dir")
done

# Check running processes
echo -e "${YELLOW}🔍 Checking running processes...${NC}"

cat >> "$REPORT_FILE" << 'EOF'

## Running Processes

### Port 3000 Usage
EOF

port_3000_pids=$(lsof -ti:3000 2>/dev/null || echo "")
if [ -n "$port_3000_pids" ]; then
    echo "| PID | Command | Status |" >> "$REPORT_FILE"
    echo "|-----|---------|--------|" >> "$REPORT_FILE"
    for pid in $port_3000_pids; do
        cmd=$(ps -p "$pid" -o command= 2>/dev/null || echo "Unknown")
        echo "| $pid | \`$cmd\` | ⚠️ Using port 3000 |" >> "$REPORT_FILE"
    done
else
    echo "✅ No processes using port 3000" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

### Next.js Development Servers
EOF

next_dev_pids=$(pgrep -f "next dev" 2>/dev/null || echo "")
if [ -n "$next_dev_pids" ]; then
    echo "| PID | Command | Status |" >> "$REPORT_FILE"
    echo "|-----|---------|--------|" >> "$REPORT_FILE"
    for pid in $next_dev_pids; do
        cmd=$(ps -p "$pid" -o command= 2>/dev/null || echo "Unknown")
        echo "| $pid | \`$cmd\` | ⚠️ Next.js dev server |" >> "$REPORT_FILE"
    done
else
    echo "✅ No Next.js development servers running" >> "$REPORT_FILE"
fi

# Generate findings and recommendations
cat >> "$REPORT_FILE" << 'EOF'

## Findings & Recommendations

### High Priority Issues
EOF

# Check for specific issues and add recommendations
if grep -q "multiple-robots\|multiple-next-configs\|multiple-tsconfigs" "$REPORT_FILE"; then
    echo "- **Duplicate configuration files detected** - May cause build conflicts" >> "$REPORT_FILE"
fi

if grep -q "Potential conflict" "$REPORT_FILE"; then
    echo "- **Parent lockfile conflicts** - May interfere with dependency resolution" >> "$REPORT_FILE"
fi

if [ -n "$port_3000_pids" ] || [ -n "$next_dev_pids" ]; then
    echo "- **Running development servers** - May interfere with new deployments" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << 'EOF'

### Medium Priority Issues
- **Build caches** - .next and .turbo directories can be safely removed
- **Multiple project copies** - Consider archiving old versions

### Low Priority Issues
- **Environment files** - .env files in parent directories may leak variables

## Recommended Actions

### Plan A (Safest - Archive & Clean)
1. Archive old project copies to ~/Archives/deeper-$(date +%Y%m%d)/
2. Remove build caches (.next, .turbo) in archived copies
3. Remove conflicting parent lockfiles
4. Clean up running processes

### Plan B (Focused - Clean Only)
1. Remove conflicting parent lockfiles
2. Clean build caches in non-active projects
3. Stop conflicting development servers

### Plan C (Minimal - Process Only)
1. Stop all Next.js development servers
2. Remove only .next directories in non-active projects

---
*Generated by audit script - Review carefully before taking action*
EOF

echo -e "${GREEN}✅ Audit complete!${NC}"
echo -e "Report saved to: ${BLUE}$REPORT_FILE${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo "Check the report above for detailed findings and recommendations."
echo "No files have been modified or deleted."
