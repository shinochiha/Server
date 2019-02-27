require('dotenv').config()

let config = {}

config.app = {}
config.app.port = process.env.APP_PORT || '9001'

config.zahir_id = {}
config.zahir_id.url = process.env.ZAHIR_ID_URL || 'https://account.zahir.id'
config.zahir_id.client_id = process.env.ZAHIR_ID_CLIENT_ID || '0f840be9b8db4d3fbd5ba2ce59211f55'
config.zahir_id.client_secret = process.env.ZAHIR_ID_CLIENT_SECRET || '6ca2f3a0a5'
config.zahir_id.username = process.env.ZAHIR_ID_USERNAME || 'rnd.zahir@gmail.com'
config.zahir_id.password = process.env.ZAHIR_ID_PASSWORD || '123456'

config.company = {}
config.company.origin = {}
config.company.origin.url = process.env.COMPANY_ORIGIN_DRIVER || 'https://app.zahironline.com'
config.company.origin.driver = process.env.COMPANY_ORIGIN_DRIVER || 'firebird'
config.company.origin.host = process.env.COMPANY_ORIGIN_HOST || 'localhost'
config.company.origin.port = process.env.COMPANY_ORIGIN_PORT || '3050'
config.company.origin.database = process.env.COMPANY_ORIGIN_DATABASE || 'C:/Data Zahir/a.gdb'
config.company.origin.user = process.env.COMPANY_ORIGIN_USERNAME || 'ZAHIRDBA'
config.company.origin.password = process.env.COMPANY_ORIGIN_PASSWORD || '20ZIANHAISR05'
config.company.origin.charset = process.env.COMPANY_ORIGIN_CHARSET || 'UTF8'
config.company.origin.lowercase_keys = process.env.COMPANY_ORIGIN_LOWERCASE_KEYS || false
config.company.origin.role = process.env.COMPANY_ORIGIN_ROLE || null
config.company.origin.pageSize = process.env.COMPANY_ORIGIN_PAGE_SIZE || null

module.exports = config
