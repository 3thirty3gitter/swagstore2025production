const fetch = require('node-fetch');

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const base = process.env.INTEGRATION_BASE_URL || 'https://www.swagstore.ca';
  const postUrl = `${base}/api/store-request`;
  const getUrl = `${base}/api/store-request`;

  const payload = {
    teamName: `Integration Test ${Date.now()}`,
    contactName: 'Integration Tester',
    contactEmail: `itest+${Date.now()}@example.com`,
    contactPhone: '555-555-5555',
    teamType: 'Test',
    description: 'Automated integration test',
  };

  console.log('Posting store request to', postUrl);
  const postRes = await fetch(postUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }});
  console.log('POST status', postRes.status);
  const postJson = await postRes.json();
  console.log('POST response', postJson);

  if (!postRes.ok) process.exit(2);

  // Poll GET for up to 30s
  const start = Date.now();
  while (Date.now() - start < 30000) {
    const getRes = await fetch(getUrl);
    const getJson = await getRes.json();
    const tenants = getJson.tenants || [];
    const found = tenants.find(t => t.contactEmail === payload.contactEmail || t.name === payload.teamName);
    if (found) {
      console.log('Found tenant in GET:', found.id || found.name);
      return;
    }
    await sleep(2000);
  }

  console.error('Tenant not found in GET after 30s');
  process.exit(3);
}

run().catch(err => { console.error(err); process.exit(1); });
