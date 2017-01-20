const {
  GraphQLString
} = require('graphql')

const {
  StateType,
  RoomType
} = require('../types')

module.exports = function(getRoom) {
  return  {
    type: GraphQLString,
    description: "Interact with a PS4",
    args: {
      state: StateType,
      room: RoomType
    },
    resolve: (_, args) => {
      return getRoom(args.room).ps4.setPowerStatus(args.state)
    }
  }
}
