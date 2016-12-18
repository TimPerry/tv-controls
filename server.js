const express = require('express')
const app = express()

const helpers = require('./helpers')

const home = require('./home.json')
const livingRoom = helpers.roomBuilder(home.rooms.livingRoom)

app.get('/livingRoom/firetv/launch/:appName', function(req, res) {
  return livingRoom.tv.setPowerStatus(true)
                   .then(livingRoom.avr.switchTo('firetv'))
                   .then(livingRoom.firetv.launchApp(req.params.appName))
                   .then(helpers.buildValidResponse(res))
                   .catch(helpers.buildErrorResponse(res))
})

app.get('/livingRoom/avr/vol/:targetVolume', function (req, res) {
  return livingRoom.tv.setPowerStatus(true)
                   .then(livingRoom.avr.setVolume(req.params.targetVolume))
                   .then(helpers.buildValidResponse(res))
                   .catch(helpers.buildErrorResponse(res))
})

app.get('/livingRoom/sky/:powerStatus', function (req, res) {
  return livingRoom.tv.setPowerStatus(true)
                   .then(livingRoom.avr.switchTo('sky'))
                   .then(livingRoom.sky.press('power'))
                   .then(helpers.buildValidResponse(res))
                   .catch(helpers.buildErrorResponse(res))
})

app.get('/livingRoom/ps4/:powerStatus', function (req, res) {
  const powerStatus = helpers.parseBoolean(req.params.powerStatus)
  return livingRoom.tv.setPowerStatus(true)
                   .then(livingRoom.avr.switchTo('ps4'))
                   .then(livingRoom.ps4.setPowerStatus(powerStatus))
                   .then(helpers.buildValidResponse(res))
                   .catch(helpers.buildErrorResponse(res))
})

app.get('/livingRoom/tv/:powerStatus', function (req, res) {
  const powerStatus = helpers.parseBoolean(req.params.powerStatus)
  return livingRoom.tv.setPowerStatus(powerStatus)
                   .then(helpers.buildValidResponse(res))
                   .catch(helpers.buildErrorResponse(res))
})

app.get('/', function(req, res) {
  return helpers.buildValidResponse(res)({status: 'ok'})
})

app.get('/livingRoom', function(req, res) {
  let payload = {}
  for (var device in livingRoom) {
    payload[device] = livingRoom[device] !== false ? 'success' : 'error'
  }
  return helpers.buildValidResponse(res)(payload)
})

app.listen(4242, function () {
  helpers.log('info', 'Server started on port 4242')
})
