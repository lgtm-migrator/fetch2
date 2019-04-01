/**
 * @file server
 * Created by Xinyi on 2019/2/13.
 */

const fs = require('fs')

const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({dest: 'test/temp/', limits: {fieldSize: 25 * 1024 * 1024}})

const bodyParser = require('body-parser')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/get', (req, res) => {
    if (Object.keys(req.query).length) {
        res.send(req.query)
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.get('/timeout', (req, res) => {
    setTimeout(() => {
        if (Object.keys(req.query).length) {
            res.send(req.query)
        } else {
            res.json({
                msg: 'Hello World!'
            })
        }
    }, 5000)
})

app.post('/post', (req, res) => {
    if (Object.keys(req.body).length) {
        res.json({
            msg: req.body.msg.split('').reverse().join('')
        })
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.post('/upload', upload.single('avatar'), (req, res) => {
    fs.writeFile(`./test/temp/upload_${Date.now()}.jpg`, req.body.file, {encoding: 'binary'}, err => {
        if (!err) res.status(200).end()
        else console.log(err)
    })
})

app.put('/put', (req, res) => {
    if (Object.keys(req.body).length) {
        res.status(204).end()
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.delete('/delete', (req, res) => {
    if (Object.keys(req.body).length) {
        res.status(201).end()
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

module.exports = app

if (!module.parent) {
    app.listen(3000)
}