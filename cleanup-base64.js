const { Redis } = require('@upstash/redis')

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('Missing Redis env vars')
  process.exit(1)
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

async function cleanupBase64() {
  try {
    console.log('Cleaning up base64 images from approved tenants...')
    
    // Clean approved tenants
    const approved = await redis.lrange('approved_tenants', 0, -1)
    console.log('Found', approved.length, 'approved tenants')
    
    const cleanedApproved = approved.map(item => {
      const tenant = typeof item === 'string' ? JSON.parse(item) : item
      
      // Remove base64 and oversized logos
      if (tenant.logoUrl && (tenant.logoUrl.startsWith('data:') || tenant.logoUrl.length > 500)) {
        console.log('Removing base64/oversized logo from:', tenant.storeName || tenant.name, 'Size:', tenant.logoUrl.length)
        tenant.logoUrl = ''
      }
      
      if (tenant.assets && tenant.assets.logoUrl && (tenant.assets.logoUrl.startsWith('data:') || tenant.assets.logoUrl.length > 500)) {
        console.log('Removing base64/oversized assets logo from:', tenant.storeName || tenant.name)
        tenant.assets.logoUrl = ''
      }
      
      return tenant
    })
    
    // Rebuild approved list
    if (cleanedApproved.length > 0) {
      await redis.del('approved_tenants')
      await redis.lpush('approved_tenants', ...cleanedApproved.map(t => JSON.stringify(t)))
    }
    
    // Clean pending tenants
    const pending = await redis.lrange('pending_tenants', 0, -1)
    console.log('Found', pending.length, 'pending tenants')
    
    const cleanedPending = pending.map(item => {
      const tenant = typeof item === 'string' ? JSON.parse(item) : item
      
      if (tenant.logoUrl && (tenant.logoUrl.startsWith('data:') || tenant.logoUrl.length > 500)) {
        console.log('Removing base64/oversized logo from pending:', tenant.storeName || tenant.name)
        tenant.logoUrl = ''
      }
      
      return tenant
    })
    
    // Rebuild pending list
    if (cleanedPending.length > 0) {
      await redis.del('pending_tenants')
      await redis.lpush('pending_tenants', ...cleanedPending.map(t => JSON.stringify(t)))
    }
    
    console.log('✅ Cleanup complete!')
    console.log('- Cleaned approved tenants:', cleanedApproved.length)
    console.log('- Cleaned pending tenants:', cleanedPending.length)
    
  } catch (e) {
    console.error('Cleanup error:', e)
  }
}

cleanupBase64()
