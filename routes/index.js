const express = require('express')
const auth = require('./auth')
const accounts = require('./data-stores/accounts')
const contacts = require('./data-stores/contacts')
const products = require('./data-stores/products')
const taxes = require('./data-stores/taxes')
const departments = require('./data-stores/departments')
const projects = require('./data-stores/projects')
const warehouses = require('./data-stores/warehouses')
const fixed_assets = require('./data-stores/fixed_assets')

const router = express.Router()

/* front end */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zahir' })
})

router.use('/auth', auth)
router.use('/accounts', accounts)
router.use('/contacts', contacts)
router.use('/products', products)
router.use('/taxes', taxes)
router.use('/departments', departments)
router.use('/projects', projects)
router.use('/warehouses', warehouses)
router.use('/fixed_assets', fixed_assets)

module.exports = router
