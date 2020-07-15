const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

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

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body

        //validate
        if(!email || !password){
            return res.status(400).json({ message: "Not all fields have been entered" })
        }

        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({ message: "No account with this email exists" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: "Either your email or password does not match" })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete("/delete", auth, async (req, res)=> {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    }catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("token")
        if (!token) return res.json(false)
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res,json(false)

        const user = await User.findById(verified.id)
        if(!user) return res.json(false)

        return res.json(true)
    }catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router