const env = process.env.NODE_ENV || 'development'

const config = {
  test: {
    vaultUrl: process.env.TEST_VAULT_URL,
    cardHost: process.env.TEST_CARD_HOST,
    interfaceUrl: process.env.TEST_INTERFACE_URL,
  },
  development: {
    vaultUrl: 'https://vault.omise.co',
    cardHost: 'http://localhost:5002',
    interfaceUrl: 'https://api.omise.co',
  },
  staging: {
    vaultUrl: 'https://vault.omise.co',
    cardHost: 'https://cdn.dev-omise.co',
    interfaceUrl: 'https://api.omise.co',
  },
  production: {
    vaultUrl: process.env.PRODUCTION_VAULT_URL,
    cardHost: process.env.PRODUCTION_CARD_HOST,
    interfaceUrl: process.env.PRODUCTION_INTERFACE_URL,
  },
}

module.exports = config[env]
