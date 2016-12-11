const fs = require('fs')

const buildValidResponse = res => payload => res.json({payload})
const buildErrorResponse = res => error => res.json({error: error.message})

const log = (level, message) => console.log(`[${level.toUpperCase()}] ${message}`)

const roomBuilder = (roomDevices) => {
  let currentDevice = {}
  try {
    let room = {}
    roomDevices.forEach((device) => {
      currentDevice = device
      const deviceFile = `./devices/${device.name}.js`
      if (fs.existsSync(deviceFile)) {
        const deviceObj = require(deviceFile)
        room[device.name] = deviceObj(device.address)
      }
    })
    return room
  } catch (e) {
    log('error', `There was a problem trying to build device ${currentDevice.name}. Details: ${e.message}`)
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
