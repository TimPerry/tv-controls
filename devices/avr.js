const denon = require('denon-avr');
const helpers = require('../helpers')

const sourceInputs = {
  firetv: 'SIBD',
  sky: 'SISAT/CBL',
  ps4: 'SIGAME'
}

const switchTo = (avr) => (input) => new Promise((resolve, reject) => {
  if (!sourceInputs.hasOwnProperty(input)) {
    return reject(`Unable to swith to unsupported input ${input}`)
  }
  avr.getSource(function(err, currentSource) {
    if (err) {
      return reject(err);
    }
    helpers.log('info', `Current source input ${currentSource}`)
    const sourceInput = sourceInputs[input]
    if (`SI${currentSource}` === sourceInput) {
      helpers.log('info', 'Current source matches target source, not doing anything')
      return resolve(`Input source is already ${input}`)
    }
    helpers.log('info', `Sending command ${sourceInput}`)
    avr.send(sourceInputs[input], '', function(err, state) {
      if (err) {
        return reject(err);
      }
      return resolve(`Changed source to input ${input}`)
    }, `Unable to switch to source input ${input}`)
  })
})

const setVolume = (avr) => (targetVolume) => new Promise((resolve, reject) => {
  avr.setVolumeAscii(targetVolume, function(err, volume) {
    if (err) {
      return reject(err);
    }
    return resolve(`The volume is now ${volume}/${avr.parseAsciiVolume(volume)} dB`)
  });
})

module.exports = function(address) {
  const avr = new denon(new denon.transports.telnet({
    host: address,
    timeout: 60000,
    execTimeout: 5000
  }));
  avr.connect();
  process.on('SIGINT', function () {
    helpers.log('error', 'Caught interrupt signal');

    avr.getConnection().destroy();
    process.exit(0);
  });

  avr.on('connect', function() {
    helpers.log('info', `Connected to AVR ${address}`)
  });

  return {
    switchTo: switchTo(avr),
    setVolume: setVolume(avr)
  }
}
