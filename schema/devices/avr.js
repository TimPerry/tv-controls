const {
  GraphQLString
} = require('graphql')

const {
  StateType,
  SourceInputType,
  VolumeType,
  RoomType
} = require('../types')

module.exports = function(getRoom) {
  return  {
    type: GraphQLString,
    description: "Interact with a AVR",
    args: {
      state: StateType,
      sourceInput: SourceInputType,
      volume: VolumeType,
      room: RoomType
    },
    resolve: (_, args) => {
      const room = getRoom(args.room)
      return Promise.all([
        args.sourceInput ? room.avr.switchTo(args.sourceInput): Promise.resolve(),
        args.volume ? room.avr.setVolume(args.volume) : Promise.resolve()
      ]).catch(err => err)
    }
  }
}
