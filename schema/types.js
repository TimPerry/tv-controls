const {
 GraphQLInt,
 GraphQLString,
 GraphQLNonNull,
 GraphQLBoolean,
 GraphQLFloat
} = require('graphql')

const {defaultRoom} = require('../home.json')

module.exports = {
  StateType: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: "The state of the power on the tv"
  },
  RoomType: {
    type: GraphQLString,
    description: `The room this device is in. Defaults to ${defaultRoom}`,
    defaultValue: defaultRoom
  },
  SourceInputType: {
    type: GraphQLString,
    description: "Which input the device should switch to"
  },
  LaunchAppType: {
    type: GraphQLString,
    description: "Which app should the device launch"
  },
  VolumeType: {
    type: GraphQLInt,
    description: "What volume should the device be set to"
  }
}
