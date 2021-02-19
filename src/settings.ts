const localServerPort = 8080

export default {
  PORT: process.env.PORT || localServerPort,
  DOMAIN: process.env.DOMAIN || `http://localhost:${localServerPort}`,
  DBNAME: 'mongodb',
  POSTGRESS_URI: process.env.POSTGRESS_URI || 'postgres://postgres:postgres@localhost:5432/chat',
  SMTP: {
    email: process.env.SMTP_EMAIL || 'zhvladik1995@gmail.com',
    password: process.env.SMTP_PASSWORD || 'MitsubishiChariot1995'
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