const fetch = require('node-fetch');
const FormData = require('form-data');

async function run() {
  const url = process.env.SMOKE_BASE_URL || 'https://www.swagstore.ca';
  const endpoint = `${url}/api/upload`;

  // 1x1 PNG base64
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
  const buffer = Buffer.from(b64, 'base64');

  const form = new FormData();
  form.append('file', buffer, { filename: 'smoke-1x1.png', contentType: 'image/png' });
  form.append('fileName', 'smoke-1x1.png');

  console.log('Posting to', endpoint);
  const res = await fetch(endpoint, { method: 'POST', body: form });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
  if (!res.ok) process.exit(2);
  try {
    const json = JSON.parse(text);
    if (!json.success || !json.url) {
      console.error('Smoke upload failed', json);
      process.exit(3);
    }
    console.log('Smoke upload succeeded, url:', json.url);
    // Verify the returned URL is accessible
    const check = await fetch(json.url, { method: 'GET' });
    console.log('GET returned', check.status, check.headers.get('content-type'));
    if (check.status !== 200) {
      console.error('Signed/public URL fetch failed');
      process.exit(5);
    }
    console.log('URL is accessible');
  } catch (err) {
    console.error('Failed to parse response:', err);
    process.exit(4);
  }
}

run().catch(err => {
  console.error('Smoke script error:', err);
  process.exit(1);
});
