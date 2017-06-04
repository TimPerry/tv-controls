const express = require('express')
const app = express()

const cors = require('cors')

const graphqlHTTP = require('express-graphql')
const schema = require('./schema')

const helpers = require('./helpers')

app.use(cors())

app.use('/', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4242, function () {
  helpers.log('info', 'Server started on port 4242')
})
