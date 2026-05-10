const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const key = process.env.GEMINI_API_KEY;
console.log('Gemini key loaded:', key ? `${key.substring(0, 15)}...` : 'NOT FOUND');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      'Say "Gemini connected" and nothing else.'
    );
    console.log('✅ Gemini works:', result.response.text());
  } catch (err) {
    console.error('❌ Gemini error:', err.message);

    const models = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-pro-latest',
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ];
    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "OK"');
        console.log(`✅ Works with model: ${modelName}`, result.response.text());
        break;
      } catch (e) {
        console.log(`  ❌ ${modelName}: ${e.message}`);
      }
    }
  }
}

testGemini();
