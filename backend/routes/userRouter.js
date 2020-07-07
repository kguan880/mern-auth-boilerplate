const router = require('express').Router()

router.get('/', (req, res) => {
    res.send("hello route is working")
})

module.exports = router