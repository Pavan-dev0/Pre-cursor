const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const key = process.env.ANAKIN_API_KEY;
console.log('Key loaded:', key ? `${key.substring(0, 15)}...` : 'NOT FOUND');
console.log('Key length:', key?.length);

async function testAllAuthFormats() {
  const testUrl = 'https://news.ycombinator.com';

  const authFormats = [
    { header: 'Authorization', value: `Bearer ${key}` },
    { header: 'Authorization', value: key },
    { header: 'X-API-Key', value: key },
    { header: 'x-api-key', value: key },
    { header: 'api-key', value: key },
  ];

  const endpoints = [
    'https://api.anakin.io/v1/url-scraper',
    'https://api.anakin.io/scrape',
    'https://api.anakin.io/v1/scrape',
    'https://api.anakin.io/v1/scrapers/url',
  ];

  for (const endpoint of endpoints) {
    for (const auth of authFormats) {
      try {
        console.log(`\nTrying: ${endpoint}`);
        console.log(`Auth: ${auth.header}: ${auth.value.substring(0, 20)}...`);

        const response = await axios.post(
          endpoint,
          { url: testUrl, format: 'markdown' },
          {
            headers: {
              'Content-Type': 'application/json',
              [auth.header]: auth.value
            },
            timeout: 10000,
            validateStatus: () => true
          }
        );

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 500));

        if (response.status === 200 || response.status === 201 || response.status === 202) {
          console.log('\n✅ SUCCESS with:');
          console.log('  Endpoint:', endpoint);
          console.log('  Auth header:', auth.header, '=', auth.value.substring(0, 20));
          return { endpoint, auth, response: response.data };
        }
      } catch (err) {
        console.log('Network error:', err.message);
      }
    }
  }

  console.log('\n❌ All combinations failed');
}

async function testExactDashboardFormat() {
  const key = process.env.ANAKIN_API_KEY;

  try {
    console.log('\n=== Testing exact dashboard format ===');
    const response = await axios.post(
      'https://api.anakin.io/scrape',
      {
        url: 'https://news.ycombinator.com',
        format: 'markdown',
        useBrowser: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        timeout: 30000,
        validateStatus: () => true
      }
    );

    console.log('Status:', response.status);
    console.log('Headers returned:', JSON.stringify(response.headers, null, 2));
    console.log('Body:', JSON.stringify(response.data, null, 2).substring(0, 1000));
  } catch (err) {
    console.log('Error:', err.message);
    if (err.response) {
      console.log('Response status:', err.response.status);
      console.log('Response body:', err.response.data);
    }
  }
}

async function main() {
  await testAllAuthFormats();
  await testExactDashboardFormat();
}

main().catch(console.error);
