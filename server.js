var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = 'mongodb://user:user@ds245518.mlab.com:45518/node-chat'

var Message = mongoose.model('message', {
    name: String,
    message: String,
    time: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)

    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err) 
                sendStatus(500)

            io.emit('message', req.body)
            res.sendStatus(200)     
    })
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('MongoDB connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})