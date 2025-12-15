import app from './app';
import { pool } from './config/database';

const PORT = process.env.PORT || 3001;

// Start server only if not in serverless environment
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    const dbType = process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'Mock Database';
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health Journal API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📝 Database: ${dbType}`);
      console.log(`🚀 Ready for requests!`);
    });
  };

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await pool.end();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await pool.end();
    process.exit(0);
  });

  startServer();
}

// Export for Vercel serverless
export default app;