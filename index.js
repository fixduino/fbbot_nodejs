'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'kuliner') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Teks diterima: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = "EAAD7FfVeZARMBAOUeK8vtnEXwE0hfdZBXgzEICGkETOSCVPsILTiJy8wttm0vKnlG8mblzbCIcNNJTcUGcCOQ5zGNtrXYkZBHNZCbdyDVmwKN4WgInbHCUyvBJqTFSKeNBw3IZCkQK32BxrYjm0x5PbO8PmsK8myWH7iVGOLMyAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "dapuralena",
                    "subtitle": "Catering harian dan event, hemat nikmat sehat",
                    "image_url": "http://dapuralena.com/user/pages/images/paketPrem2.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.dapuralena.com",
                        "title": "web"
                    }, {
                        "type": "postback",
                        "title": "Lainnya",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Preksu Jogja",
                    "subtitle": "Ayam Geprek dan Susu",
                    "image_url": "http://eatjogja.com/wp-content/uploads/2014/06/PREKSU-FEATURED-IMAGE.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Lainnya",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
