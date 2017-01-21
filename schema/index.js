const fs = require('fs')
const path = require('path')
const helpers = require('../helpers')

const home = require('../home.json')
const rooms = {
  livingRoom: helpers.roomBuilder(home.rooms.livingRoom)
}

const {
 GraphQLSchema,
 GraphQLObjectType
} = require('graphql')

const getRoom = (roomName) => rooms[roomName]

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'Control devices',
  fields: () => {
    let fields = {}
    const devicesFolder = path.join(__dirname, './devices')
    var files = fs.readdirSync(devicesFolder)
    files.forEach(file => {
      try {
        fields[path.basename(file, '.js').toUpperCase()] = require(devicesFolder + '/' + file)(getRoom)
      } catch (e) {
        helpers.log('error', 'Error whilst trying to load file: ' + file + '. Details:' + e)
      }
    })
    return fields
  }
})

module.exports = new GraphQLSchema({
 query
});
