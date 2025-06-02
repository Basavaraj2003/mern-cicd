const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();

const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Create a separate registry for frontend metrics
const frontendRegister = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'mern-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a counter metric for backend requests
const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Register the counter
register.registerMetric(httpRequestsCounter);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to collect backend metrics
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.path !== '/metrics' && !req.path.startsWith('/metrics/frontend')) { // Avoid counting metrics endpoints
      httpRequestsCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status: res.statusCode,
      });
    }
  });
  next();
});

// Endpoint to receive frontend metrics
app.post('/metrics/frontend', async (req, res) => {
  try {
    const metrics = req.body.metrics;
    if (metrics) {
      // Process and register frontend metrics
      // This is a simplified example, you might need to parse and register based on your frontend metrics structure
      // For demonstration, assuming frontend sends metrics in Prometheus text format
      frontendRegister.metrics(metrics);
      res.status(200).send('Metrics received');
    } else {
      res.status(400).send('No metrics data received');
    }
  } catch (error) {
    console.error('Error receiving frontend metrics:', error);
    res.status(500).send('Failed to process frontend metrics');
  }
});

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://devops:Basu%402003@cluster0.cwufnhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'devops';  // Replace with your actual DB name

let db;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// API Routes

// Get all analyses
app.get('/api/analyses', async (req, res) => {
  try {
    const analyses = await db.collection('analyses').find({}).sort({ timestamp: -1 }).toArray();
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Get a specific analysis by ID
app.get('/api/analyses/:id', async (req, res) => {
  try {
    const analysis = await db.collection('analyses').findOne({ _id: new ObjectId(req.params.id) });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// Create a new analysis
app.post('/api/analyses', async (req, res) => {
  try {
    const { code, score, issues } = req.body;
    const result = await db.collection('analyses').insertOne({
      code,
      score,
      issues,
      timestamp: new Date()
    });
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('Error saving analysis:', error);
    res.status(500).json({ error: 'Failed to save analysis' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  // Combine backend and frontend metrics
  const backendMetrics = await register.metrics();
  const frontendMetrics = await frontendRegister.metrics(); // Assuming frontend metrics are stored in frontendRegister
  
  res.setHeader('Content-Type', register.contentType);
  res.end(backendMetrics + '\n' + frontendMetrics);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  if (db) {
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } else {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', async () => {
  await connectToDatabase();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Prometheus metrics available at http://localhost:${PORT}/metrics`);
  console.log(`Frontend metrics endpoint available at http://localhost:${PORT}/metrics/frontend (for receiving data)`);
});
