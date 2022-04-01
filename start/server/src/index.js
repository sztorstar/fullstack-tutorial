require('dotenv').config();

const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const { createStore } = require('./utils')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const resolvers = require('./resolvers')

const store = createStore()

console.log('env', process.env.NODE_ENV !== 'production')

const isEmail = require('isemail')

const server = new ApolloServer({
    typeDefs,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store })
    }),
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    context: async ({req}) => {
        const auth = req.headers && req.headers.authorization || ''
        console.log({auth})
        const email = Buffer.from(auth, 'base64').toString('ascii')
        if(!isEmail.validate(email))return {user: null}
        const users = await store.users.findOrCreate({ where: {email}})
        const user = users && users[0]|| null
        return { user: { ...user.dataValues }}
    },
    apollo: {
      key: process.env.APOLLO_KEY,
    },
    // cors: false,
})

server.listen().then(() => {
    console.log(`
        server is running
        listening on port 4000
    `)
})