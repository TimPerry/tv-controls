const {
  GraphQLString
} = require('graphql')

const {
  StateType,
  RoomType
} = require('../types')

module.exports = function(getRoom) {
  return {
    type: GraphQLString,
    description: "Interact with a TV",
    args: {
      state: StateType,
      room: RoomType
    },
    resolve: (_,args) => {
      return getRoom(args.room).tv.setPowerStatus(args.state)
    }
  }
}
