const fs = require('fs');
const path = require('path');
const { getAdminApp } = require('../src/lib/firebase-admin');

async function run() {
  const file = process.argv[2];
  const mode = process.argv[3] || 'dry'; // 'dry' or 'run'
  if (!file) {
    console.error('Usage: node migrate-pending-tenants.js <file.json> [run|dry]');
    process.exit(1);
  }

  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error('File not found:', full);
    process.exit(1);
  }

  const raw = fs.readFileSync(full, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.error('Expected JSON array of tenant objects');
    process.exit(1);
  }

  console.log(`Loaded ${data.length} tenants from ${full}. Mode=${mode}`);

  if (mode === 'dry') {
    data.slice(0, 5).forEach(t => console.log('SAMPLE:', t.id || t.name));
    console.log('Dry run complete. To actually write, run with `run` argument.');
    return;
  }

  const { db } = getAdminApp();
  for (const t of data) {
    const id = t.id || `tenant_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    try {
      await db.collection('pendingTenants').doc(id).set(t);
      console.log('Wrote', id);
    } catch (err) {
      console.error('Failed to write', id, err);
    }
  }
  console.log('Migration complete');
}

run().catch(err => { console.error(err); process.exit(1); });
