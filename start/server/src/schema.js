const {gql} = require('apollo-server')

const typeDefs = gql `
  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    type: String
    name: String
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  type User {
      id: ID!
      trips: [Launch]!
      email: String!
      token: String
  }

  enum PatchSize {
      SMALL
      LARGE
  }

  type LaunchConnection {
      cursor: String!
      hasMore: Boolean!
      launches: [Launch]!
  }

  type Query {
    launches(pageSize: Int, after: String): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
`

module.exports = typeDefs