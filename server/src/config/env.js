const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crop-recommendation',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:5000',
  dataGovApiKey: process.env.DATA_GOV_API_KEY || '',
  dataGovResourceId: process.env.DATA_GOV_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070',
  dataGovBaseUrl: process.env.DATA_GOV_BASE_URL || 'https://api.data.gov.in/resource',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: process.env.SMTP_PORT || 587,
  smtpEmail: process.env.SMTP_EMAIL || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  fromEmail: process.env.FROM_EMAIL || 'noreply@agrosmart.com',
  fromName: process.env.FROM_NAME || 'AgroSmart Support',
};
