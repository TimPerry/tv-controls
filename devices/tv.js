const request = require('request')
const helpers = require('../helpers')

const setPowerStatus = address => status => {
  const postData = {"id":2,"method":"setPowerStatus","version":"1.0","params":[{ "status": status }]}
  const url = `http://${address}/sony/system`
  const headers = {
    "X-Auth-PSK": "0000",
    "Content-Type": "application/json"
  }
  const options = {
    method: 'post',
    body: postData,
    headers: headers,
    json: true,
    url: url
  }
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (err) {
        return reject(err)
      }
      if (body.error) {
        const [errorCode, errorMessage] = body.error
        if (errorCode === 15) {
          return resolve(`TV Already on, not doing anything. Details: ${errorMessage}`)
        }
      }
      return resolve(`TV state was successfully set to ${status}`)
    })
  })
}

module.exports = function(address) {
  return {
    setPowerStatus: setPowerStatus(address)
  }
}
