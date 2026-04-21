const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Directories
const UPLOAD_ROOT = path.join(__dirname, '..');
const UPLOAD_DIR = path.join(UPLOAD_ROOT, 'uploads');
const PROCESSED_DIR = path.join(UPLOAD_ROOT, 'processed');

// Ensure directories exist
[UPLOAD_DIR, PROCESSED_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Static files access for uploaded and processed images
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/processed', express.static(PROCESSED_DIR));

// Configure Multer for storage
// Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'active', 
        system: 'Brain Tumor Insight API', 
        version: '1.0.0',
        endpoints: ['/api/predict'] 
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const { db } = require('./firebaseAdmin');

// API Route: Clean, Predict, and Save to Firestore
app.post('/api/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const inputPath = req.file.path;
    const cleanedPath = inputPath.replace('uploads', 'processed').replace(/\.(?=[^.]*$)/, '_cleaned.');
    
    console.log(`Step 1: Cleaning image...`);
    
    // Stage 1: OpenCV Clearing
    const cleanProcess = spawn('python', [
        path.join(__dirname, '..', 'ai_model', 'cleaner.py'),
        inputPath,
        cleanedPath
    ]);

    let cleanError = '';
    cleanProcess.stderr.on('data', (data) => cleanError += data.toString());

    cleanProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                error: 'Image clearing failed', 
                details: cleanError || 'OpenCV process exited with error.' 
            });
        }

        console.log(`Step 2: Analyzing cleaned image...`);

        // Stage 2: CNN Prediction
        const predictProcess = spawn('python', [
            path.join(__dirname, '..', 'ai_model', 'predict.py'),
            cleanedPath
        ]);

        let resultData = '';
        let predictError = '';
        predictProcess.stdout.on('data', (data) => resultData += data.toString());
        predictProcess.stderr.on('data', (data) => predictError += data.toString());
        
        predictProcess.on('close', async (pCode) => {
            if (pCode !== 0) {
                return res.status(500).json({ 
                    error: 'AI analysis failed', 
                    details: predictError || 'Prediction process exited with error.' 
                });
            }

            try {
                const analysisResult = JSON.parse(resultData);
                
                // Stage 3: Save to Firebase Firestore
                console.log(`Step 3: Saving to Firestore...`);
                try {
                    if (db && typeof db.collection === 'function') {
                        const docRef = await db.collection('scans').add({
                            type: analysisResult.prediction,
                            confidence: analysisResult.confidence,
                            size: analysisResult.size_estimation,
                            originalName: req.file.originalname,
                            timestamp: new Date().toISOString(),
                            status: 'completed'
                        });
                        analysisResult.firebaseId = docRef.id;
                        console.log(`Saved to Firestore with ID: ${docRef.id}`);
                    } else {
                        throw new Error('Firestore not initialized');
                    }
                } catch (dbError) {
                    console.warn('Could not save to Firestore (likely missing credentials). Analysis succeeded locally.');
                }

                res.json({
                    ...analysisResult,
                    originalUrl: `/uploads/${path.basename(inputPath)}`,
                    cleanedUrl: `/processed/${path.basename(cleanedPath)}`
                });
            } catch (e) {
                res.status(500).json({ error: 'Failed to synthesize results' });
            }
        });
    });
});

// API Route: Status check
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
