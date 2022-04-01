import {
    ApolloClient,
    ApolloProvider,
    gql,
    NormalizedCacheObject,
    useQuery
} from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom'

import { cache } from './cache'
import Pages from './pages'
import injectedStyle from './styles'
import Login from './pages/login';

injectedStyle()

export const typeDefs = gql`
  extend type Query {
      isUserLoggedIn: Boolean!
  }
`

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isUserLoggedIn @client
  }
`
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token') || '',
      'client-name': 'Space Explorer [web]',
      'client-version': '1.0.0',
    },
    typeDefs,
    resolvers: {},
  });

function IsLoggedIn() {
    const {data} = useQuery(IS_LOGGED_IN);
    return data?.isUserLoggedIn ? <Pages /> : <Login />;
}

// client.query({
//     query: gql`
//       query TestQuery {
//           launch(id: 56){
//               id
//               mission {
//                   name
//               }
//           }
//       }
    
//     `
// }).then(result => console.log(result))

ReactDOM.render(
    <ApolloProvider client={client}>
       <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
)