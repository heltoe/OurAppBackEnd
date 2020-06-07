export default {
  PORT: process.env.PORT || 3000,
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  DBNAME: 'mongodb',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
  SMTP: {
    email: process.env.SMTP_EMAIL || 'zhvladik1995@gmail.com',
    password: process.env.SMTP_PASSWORD || 'MitsubishiChariot'
  },
  JWT: {
    secret: '1a2b-3c4d-5e6f-7g8h',
    access: {
      type: 'access',
      expiresIn: '30m'
    },
    refresh: {
      type: 'refresh',
      expiresIn: '24h'
    }
  }
}