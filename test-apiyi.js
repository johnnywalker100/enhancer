/**
 * Test script for API易 Nano Banana Pro integration
 * 
 * Usage: node test-apiyi.js
 * 
 * Make sure to set APIYI_API_KEY in your .env.local file
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const APIYI_API_KEY = process.env.APIYI_API_KEY;

if (!APIYI_API_KEY) {
  console.error('❌ Error: APIYI_API_KEY is not set in .env.local');
  console.error('Please add: APIYI_API_KEY=your_api_key_here');
  process.exit(1);
}

async function testAPIYI() {
  console.log('🧪 Testing API易 Nano Banana Pro Integration\n');
  
  // Simple test prompt
  const testPrompt = 'A beautiful sunset over mountains';
  
  console.log('📝 Test prompt:', testPrompt);
  console.log('🔑 API Key:', APIYI_API_KEY.substring(0, 10) + '...\n');
  
  // Create a simple test image (1x1 red pixel)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: testPrompt
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: testImageBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: '1:1',
        imageSize: '1K'
      }
    }
  };
  
  console.log('🚀 Calling API易 endpoint...');
  
  try {
    const apiUrl = 'https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APIYI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('📊 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      process.exit(1);
    }
    
    const result = await response.json();
    console.log('\n✅ API call successful!\n');
    
    // Check response structure
    if (result.candidates && result.candidates.length > 0) {
      const candidate = result.candidates[0];
      console.log('📋 Response details:');
      console.log('  - Finish reason:', candidate.finishReason);
      console.log('  - Safety ratings:', candidate.safetyRatings?.length || 0, 'ratings');
      
      const imageData = candidate.content?.parts?.[0]?.inlineData?.data;
      if (imageData) {
        console.log('  - Image data received: ✅');
        console.log('  - Image size:', imageData.length, 'characters (base64)');
        console.log('  - MIME type:', candidate.content?.parts?.[0]?.inlineData?.mimeType);
        
        // Optionally save test image
        const outputPath = path.join(__dirname, 'test-output.png');
        fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
        console.log('  - Saved test image to:', outputPath);
      } else {
        console.log('  - Image data: ❌ Not found');
      }
    } else {
      console.log('❌ No candidates in response');
      console.log('Full response:', JSON.stringify(result, null, 2));
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test
testAPIYI().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
