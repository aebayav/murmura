// Normalize API URL: ensure it has a protocol and no trailing slash.
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const normalizeApiUrl = (u) => {
  if (!u) return 'http://localhost:3000/api'
  // If already absolute (http/https), use it and remove trailing slash
  if (/^https?:\/\//i.test(u)) return u.replace(/\/+$/, '')
  // Otherwise assume https and ensure no leading/trailing slashes
  return 'https://' + u.replace(/^\/+/, '').replace(/\/+$/, '')
}

const config = {
  apiUrl: normalizeApiUrl(rawApiUrl),
  appName: import.meta.env.VITE_APP_NAME || 'Murmura',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
