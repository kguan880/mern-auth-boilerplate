const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.header("token")

        if (!token) {
            return res.status(401).json({ message: "You are not authorised to access this page" })
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if(!verified){
            return res.status(401).json({ message: "Verification denied, authorisation failed" })
        }

        req.user = verified.id
        next()
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = auth