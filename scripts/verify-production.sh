#!/bin/bash
# Production Verification Script
# Run this after deployment to verify critical endpoints

DOMAIN="${1:-www.swagstore.ca}"
BASE_URL="https://$DOMAIN"

echo "================================"
echo "SwagStore Production Verification"
echo "Testing: $BASE_URL"
echo "================================"
echo ""

# Test 1: Homepage
echo "1. Testing Homepage..."
HOMEPAGE=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$HOMEPAGE" = "200" ]; then
    echo "   ✅ Homepage: OK (200)"
else
    echo "   ❌ Homepage: FAILED ($HOMEPAGE)"
fi

# Test 2: Admin Login Page
echo "2. Testing Admin Login..."
ADMIN=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/admin/login")
if [ "$ADMIN" = "200" ]; then
    echo "   ✅ Admin Login: OK (200)"
else
    echo "   ❌ Admin Login: FAILED ($ADMIN)"
fi

# Test 3: Admin Tenants Page (requires auth, but should not 500)
echo "3. Testing Admin Tenants Page..."
TENANTS=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/admin/tenants")
if [ "$TENANTS" = "200" ] || [ "$TENANTS" = "302" ] || [ "$TENANTS" = "401" ]; then
    echo "   ✅ Admin Tenants: OK ($TENANTS - auth required is expected)"
else
    echo "   ❌ Admin Tenants: FAILED ($TENANTS)"
fi

# Test 4: API Health Check (tenant API without params should return 400, not 500)
echo "4. Testing Admin Tenant API..."
API=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/api/admin/tenant")
if [ "$API" = "400" ]; then
    echo "   ✅ Admin API: OK (400 - missing params as expected)"
elif [ "$API" = "401" ]; then
    echo "   ✅ Admin API: OK (401 - auth required)"
else
    echo "   ⚠️  Admin API: Unexpected ($API)"
fi

# Test 5: Store Request Page
echo "5. Testing Store Request Page..."
REQUEST=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL/request-store")
if [ "$REQUEST" = "200" ]; then
    echo "   ✅ Request Store: OK (200)"
else
    echo "   ❌ Request Store: FAILED ($REQUEST)"
fi

echo ""
echo "================================"
echo "Verification Complete"
echo "================================"
echo ""
echo "Next Steps:"
echo "1. If all tests passed, manually test:"
echo "   - Login to admin"
echo "   - Create a tenant"
echo "   - Navigate away and back to verify persistence"
echo "   - Open website editor"
echo "   - Visit tenant storefront"
echo ""
echo "2. If any tests failed, check:"
echo "   - Vercel deployment logs"
echo "   - Environment variables in Vercel dashboard"
echo "   - Firebase console for errors"
