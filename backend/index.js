const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

//setup express

const server = express()
server.use(express.json())
server.use(cors())

const port = process.env.PORT || 5000

//run server

server.listen(port, () => {
    console.log("Server is running on port: ", port)
})

//set up mongoose

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, (err) => {
    if (err) throw(err)
    console.log('MongoDB connected')
})

//set up routes

server.use("/users", require('./routes/userRouter'))