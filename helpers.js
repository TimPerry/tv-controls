const fs = require('fs')

const log = (level, message) => console.log(`[${level.toUpperCase()}] ${message}`)

const roomBuilder = (roomDevices) => {
  try {
    let room = {}
    roomDevices.forEach((device) => {
      if(device.disabled) {
        return false
      }
      try {
        const deviceFile = `./devices/${device.name}.js`
        if (fs.existsSync(deviceFile)) {
          const deviceObj = require(deviceFile)
          room[device.name] = deviceObj(device.address)
        }
      } catch (e) {
        log('error', `There was a problem trying to device ${device.name}. Details: ${e.message} . Line number: ${e.stack.split('\n')[0]}`)
      }
    })
    return room
  } catch (e) {
    log('error', `There was a problem trying to build room. Details: ${e.message}`)
  }
}

module.exports = {
  roomBuilder,
  log
}
