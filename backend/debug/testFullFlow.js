const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');

const BASE = 'http://localhost:3001';
const topic = 'Bangalore B2B SaaS';

async function testFullFlow() {
  console.log('=== PRECURSOR FULL FLOW TEST ===\n');

  console.log('1. Testing /health...');
  const health = await axios.get(`${BASE}/health`);
  console.log('✅ Health:', health.data);

  console.log('\n2. Testing /api/scan...');
  console.log('   Topic:', topic);
  console.log('   This may take 30-60 seconds...');
  const scanStart = Date.now();

  const scan = await axios.post(`${BASE}/api/scan`,
    { topic },
    { timeout: 120000 }
  );

  console.log(`✅ Scan completed in ${((Date.now()-scanStart)/1000).toFixed(1)}s`);
  console.log('   Sources attempted:', scan.data.sourcesAttempted);
  console.log('   Sources succeeded:', scan.data.sourcesSucceeded);
  console.log('   First source preview:',
    scan.data.sources?.[0]?.markdown?.substring(0, 100));

  console.log('\n3. Testing /api/analyze...');
  const analyzeStart = Date.now();

  const analyze = await axios.post(`${BASE}/api/analyze`,
    { topic, sources: scan.data.sources },
    { timeout: 60000 }
  );

  console.log(`✅ Analysis completed in ${((Date.now()-analyzeStart)/1000).toFixed(1)}s`);
  console.log('   Consensus signals:', analyze.data.consensus?.length);
  console.log('   Contradictions:', analyze.data.contradictions?.length);
  console.log('   Silence signals:', analyze.data.silenceSignals?.length);
  console.log('   First consensus:', analyze.data.consensus?.[0]?.claim?.substring(0, 80));

  console.log('\n4. Testing /api/prophecy...');
  const prophecyStart = Date.now();

  const prophecy = await axios.post(`${BASE}/api/prophecy`,
    { topic, analysis: analyze.data },
    { timeout: 60000 }
  );

  console.log(`✅ Prophecy completed in ${((Date.now()-prophecyStart)/1000).toFixed(1)}s`);
  console.log('   Prophecies generated:', prophecy.data.prophecies?.length);
  console.log('   First prophecy:', prophecy.data.prophecies?.[0]?.statement?.substring(0, 80));
  console.log('   Confidence:', prophecy.data.prophecies?.[0]?.confidence);

  console.log('\n=== ✅ FULL FLOW PASSED ===');
  console.log(`Total time: ${((Date.now()-scanStart)/1000).toFixed(1)}s`);
}

testFullFlow().catch(err => {
  console.error('\n❌ FLOW FAILED:', err.message);
  if (err.response) {
    console.error('Response:', err.response.status, err.response.data);
  }
  process.exit(1);
});
