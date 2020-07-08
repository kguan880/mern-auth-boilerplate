const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
    try {
        const { email, password, passwordCheck, username } = req.body

        //validate

        if (!email || !password || !passwordCheck || !username) {
            return res.status(400).json({ message: "Not all fields have been entered" })
        }
        if (password.length < 5) {
            return res.status(400).json({ message: "Password needs to be at least 5 characters long" })
        }
        if (password !== passwordCheck) {
            return res.status(400).json({ message: "Please enter matching passwords" })
        }

        const existingEmail = await User.findOne({ email: email })
        const existingUsername = await User.findOne({ username: username })
        if (existingEmail) {
            return res.status(400).json({ message: "An account with this email already exists" })
        }
        if (existingUsername) {
            return res.status(400).json({ message: "An account with this username already exists" })
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        })
        const savedUser = await newUser.save()
        res.json(savedUser)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router