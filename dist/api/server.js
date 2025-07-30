import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
// Import routes
import boilerInfoRoutes from './routes/boiler-info.js';
import maintenanceRoutes from './routes/maintenance.js';
import purchaseRoutes from './routes/purchase.js';
import emailRoutes from './routes/email.js';
// Load environment variables
config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Boiler Maintenance API',
        version: '1.0.0'
    });
});
// API routes
app.use('/api/boiler-info', boilerInfoRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/email', emailRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// 404 handler - commented out to avoid path-to-regexp issue
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Endpoint not found',
//     message: `Route ${req.originalUrl} does not exist`
//   });
// });
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Boiler Maintenance API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
export default app;
//# sourceMappingURL=server.js.map