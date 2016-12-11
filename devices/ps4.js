const exec = require('child_process').exec

const helpers = require('../helpers')

const runCommand = (address, args) => new Promise((resolve, reject) => {
  const command = `./node_modules/.bin/ps4-waker ${args}`
  helpers.log('info', `Running ps4 waker command: ${command}`)
  exec(command, (err, stdout, stderr) => {
    helpers.log('info', err)
    helpers.log('info', stdout)
    helpers.log('info', stderr)
    if (err) {
      return reject(err)
    }
    resolve(`PS4 Waker command '${command || 'default'} done`)
  })
})

module.exports = function(address) {
  return {
    setPowerStatus: (status) => runCommand(address, status ? '' : 'standby')
  }
}
