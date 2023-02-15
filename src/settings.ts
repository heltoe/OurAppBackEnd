const PORT = process.env.PORT || 8080
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`
const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgress'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'root'
const POSTGRES_DB = process.env.POSTGRES_DB || "chat"
const email = process.env.SMTP_EMAIL || 'zhvladik1995@gmail.com'
const password = process.env.SMTP_PASSWORD || 'MitsubishiChariot1995'

export default {
  PORT: PORT,
  DOMAIN: DOMAIN,
  POSTGRES_PORT: POSTGRES_PORT,
  POSTGRES_HOST: POSTGRES_HOST,
  POSTGRES_USER: POSTGRES_USER,
  POSTGRES_PASSWORD: POSTGRES_PASSWORD,
  POSTGRES_DB: POSTGRES_DB,
  POSTGRESS_URI: process.env.POSTGRESS_URI || `postgres://postgres:postgres@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  SMTP: {
    email: email,
    password: password
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