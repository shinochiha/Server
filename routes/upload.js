const express = require('express')
const request = require('request')
const config = require('../config')
const router = express.Router()

router.post('/', (req, res, next) => {
  let uploadFile = req.files.file
  const fileName = req.files.file.name
  uploadFile.mv(
    `${__dirname}/../../databases/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.json({
        file: `${__dirname}/../../databases/${fileName}`,
      })
    },
  )
})
module.exports = router
