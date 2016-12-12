const fs = require('fs')

const buildValidResponse = res => payload => res.json({payload})
const buildErrorResponse = res => error => res.json({error: error.message})

const log = (level, message) => console.log(`[${level.toUpperCase()}] ${message}`)

const roomBuilder = (roomDevices) => {
  try {
    let room = {}
    roomDevices.forEach((device) => {
      try {
        const deviceFile = `./devices/${device.name}.js`
        if (fs.existsSync(deviceFile)) {
          const deviceObj = require(deviceFile)
          room[device.name] = deviceObj(device.address)
        }
      } catch (e) {
        log('error', `There was a problem trying to device ${device.name}. Details: ${e.message}`)
        room[device.name] = false
      }
    })
    return room
  } catch (e) {
    log('error', `There was a problem trying to build room. Details: ${e.message}`)
  }
}

const parseBoolean = (boolStr) => JSON.parse(boolStr)

module.exports = {
  buildValidResponse,
  buildErrorResponse,
  roomBuilder,
  log,
  parseBoolean
}
