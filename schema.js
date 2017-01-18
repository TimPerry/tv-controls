const helpers = require('./helpers')

const home = require('./home.json')
const rooms = {
  livingRoom: helpers.roomBuilder(home.rooms.livingRoom)
}

const {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
 GraphQLNonNull,
 GraphQLID,
 GraphQLBoolean,
 GraphQLFloat
} = require('graphql')

const defaultRoom = 'livingRoom'
const getRoom = (roomName) => roomName ? rooms[roomName] : rooms[defaultRoom]

const roomType = {
  type: GraphQLString,
  description: "The room this device is in, defaults to living room"
}

const query = new GraphQLObjectType({
  name: "Query",
  description: "Control devices",
  fields: () => ({
    TV: {
      type: GraphQLString,
      description: "Interact with a TV",
      args: {
        state: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: "The state of the power on the tv"
        },
        room: roomType
      },
      resolve: (_,args) => {
        return getRoom(args.room).tv.setPowerStatus(args.state)
      }
    },
    AVR: {
      type: GraphQLString,
      description: "Interact with a AVR",
      args: {
        state: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: "The state of the power on the AVR"
        },
        sourceInput: {
          type: GraphQLString,
          description: "Which input the AVR should switch to"
        },
        volume: {
          type: GraphQLInt,
          description: "What volume should the AVR be set to"
        },
        room: roomType
      },
      resolve: (_, args) => {
        const room = getroom(args.room)
        return Promise.all([
          args.sourceInput ? room.avr.switchTo(args.sourceInput): Promise.resolve(),
          args.volume ? room.avr.setVolume(args.volume) : Promise.resolve()
        ]).catch(err => err)
      }
    },
    PS4: {
      type: GraphQLString,
      description: "Interact with a PS4",
      args: {
        state: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: "The state of the power on the PS4"
        },
        room: roomType
      },
      resolve: (_, args) => {
        return getRoom(args.room).ps4.setPowerStatus(args.state)
      }
    },
    Sky: {
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
  })
});

module.exports = new GraphQLSchema({
 query
});
