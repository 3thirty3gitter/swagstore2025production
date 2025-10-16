#!/bin/bash

# Website Editor Endpoint Testing Script
# Tests all critical endpoints for the website editor functionality

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Website Editor Endpoints Test                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PROD_URL="https://www.swagstore.ca"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    echo -n "Testing ${name}... "
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "${url}")
    
    if [ "$http_code" == "$expected" ]; then
        echo -e "${GREEN}✅ OK${NC} (${http_code})"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: ${expected}, Got: ${http_code})"
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Core Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Homepage" "${PROD_URL}/" "200"
test_endpoint "Admin Login" "${PROD_URL}/admin/login" "200"
test_endpoint "Admin Dashboard" "${PROD_URL}/admin" "200"
test_endpoint "Admin Tenants" "${PROD_URL}/admin/tenants" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Tenant API (no params)" "${PROD_URL}/api/admin/tenant" "400"
test_endpoint "Upload API (no auth)" "${PROD_URL}/api/upload" "405"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Editor Components Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if editor files exist
check_file() {
    local name="$1"
    local path="$2"
    
    echo -n "Checking ${name}... "
    
    if [ -f "${path}" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        return 0
    else
        echo -e "${RED}❌ MISSING${NC}"
        return 1
    fi
}

check_file "TenantEditor Component" "src/components/admin/tenant-editor.tsx"
check_file "SectionEditorModal" "src/components/admin/editor/section-editor-modal.tsx"
check_file "Editor Page" "src/app/admin/tenants/[tenantId]/editor/page.tsx"
check_file "Hero Section" "src/components/store/sections/hero-section.tsx"
check_file "Product List Section" "src/components/store/sections/product-list-section.tsx"
check_file "Image With Text Section" "src/components/store/sections/image-with-text-section.tsx"
check_file "Swag Bucks Tracker" "src/components/store/sections/swag-bucks-tracker.tsx"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Server Actions Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_action() {
    local name="$1"
    local pattern="$2"
    
    echo -n "Checking ${name}... "
    
    if grep -q "${pattern}" src/lib/actions.ts; then
        echo -e "${GREEN}✅ FOUND${NC}"
        return 0
    else
        echo -e "${RED}❌ MISSING${NC}"
        return 1
    fi
}

check_action "saveWebsite" "export async function saveWebsite"
check_action "uploadFile" "export async function uploadFile"
check_action "saveTenant" "export async function saveTenant"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Environment Variables Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_env() {
    local name="$1"
    local var="$2"
    
    echo -n "Checking ${name}... "
    
    if [ -n "${!var}" ]; then
        echo -e "${GREEN}✅ SET${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  NOT SET (may be in Vercel only)${NC}"
        return 0
    fi
}

check_env "Firebase Project ID" "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
check_env "Firebase API Key" "NEXT_PUBLIC_FIREBASE_API_KEY"
check_env "Firebase Storage Bucket" "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Test Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo "1. Login to admin at: ${PROD_URL}/admin/login"
echo "2. Navigate to Tenants page"
echo "3. Click 'Edit Website' on any tenant"
echo "4. Follow the manual testing checklist in EDITOR_VERIFICATION.md"
echo ""
