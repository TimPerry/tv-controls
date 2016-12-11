var adb = require('adbkit')
var client = adb.createClient()

const apps = {
  netflix: 'com.netflix.ninja',
  youtube: 'org.chromium.youtube_apk',
  iplayer: 'uk.co.bbc.iplayer',
  home: 'com.amazon.tv.launcher'
}

const launchApp = (client, fireTvId) => (appName) => () => {
  if (!apps[appName]) {
    throw new Error(`The provided app name '${appName}' is not supported`)
  }
  const command = `monkey -p ${apps[appName]} -c android.intent.category.LAUNCHER 1`
  return client
    .shell(fireTvId, command)
    .then(adb.util.readAll)
}

module.exports = function (address) {
  return {
    launchApp: launchApp(client, address)
  }
}

