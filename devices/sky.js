var SkyRemote = require('sky-remote');

const pressOnControl = (remoteControl) => (input) => new Promise((resolve, reject) => {
  remoteControl.press(input, function(err) {
    if (err) {
      return reject(err)
    }
    resolve(`Button/s ${input} pressed`)
  })
})

module.exports = function(address) {
  var remoteControl = new SkyRemote(address);

  return {
    press: pressOnControl(remoteControl)
  }
}
