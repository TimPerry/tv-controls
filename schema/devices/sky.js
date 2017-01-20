const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')

const {
  StateType,
  RoomType
} = require('../types')

module.exports = function(getRoom) {
  return  {
    type: GraphQLString,
    description: "Interact with a Sky box",
    args: {
      state: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: "The state of the power on the Sky box"
      }
    },
    resolve: (_, args) => {
      return getRoom(args.room).sky.press('power')
    }
  }
}
