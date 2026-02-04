/**
 * Firebase Storage CORS Configuration Script
 * Run this script with: node setup-cors.js
 * 
 * Prerequisites:
 * 1. You must be authenticated with gcloud: gcloud auth login
 * 2. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable
 */

const { Storage } = require('@google-cloud/storage');

const corsConfiguration = [
    {
        origin: ['*'], // Allow all origins (you can restrict to specific domains in production)
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: [
            'Content-Type',
            'Access-Control-Allow-Origin',
            'x-goog-resumable',
            'x-goog-meta-*'
        ]
    }
];

async function setCors() {
    try {
        // Note: This requires authentication with Google Cloud
        const storage = new Storage();
        const bucketName = 'fashionstore-3ca81.firebasestorage.app';

        await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
        console.log(`✅ CORS configuration set successfully for bucket: ${bucketName}`);
        console.log('CORS Rules:', JSON.stringify(corsConfiguration, null, 2));
    } catch (error) {
        console.error('❌ Error setting CORS:', error.message);
        console.log('\n📋 ALTERNATIVE: Please set CORS manually via Google Cloud Console:');
        console.log('1. Go to: https://console.cloud.google.com/storage/browser/fashionstore-3ca81.firebasestorage.app');
        console.log('2. Click the bucket name');
        console.log('3. Go to "Permissions" tab');
        console.log('4. Click "Edit CORS" under "Cross-origin resource sharing (CORS)"');
        console.log('5. Add the following configuration:\n');
        console.log(JSON.stringify(corsConfiguration, null, 2));
    }
}

setCors();
