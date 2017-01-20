const {
  GraphQLString
} = require('graphql')

const {
LaunchAppType
} = require('../types')

module.exports = function(getRoom) {
  return  {
    type: GraphQLString,
    description: "Interact with a AVR",
    args: {
      launchApp: LaunchAppType
    },
    resolve: (_, args) => {
      const room = getRoom(args.room)
      return room.firetv.launchApp(args.launchApp)
    }
  }
}
