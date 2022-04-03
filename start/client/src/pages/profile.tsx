import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';
import { LAUNCH_TILE_DATA } from './launches';
import { Header, Loading } from '../components';
import LaunchTile from '../components/launch-tile';

const USER_PROFILE = gql`
  query GetMyTrips {
    me {
      trips {
        ...LaunchTile
      }
      email
      id
    }
  }
  ${LAUNCH_TILE_DATA}
`

interface ProfileProps extends RouteComponentProps {}

const Profile: React.FC<ProfileProps> = () => {
  const {data, error, loading} = useQuery(USER_PROFILE, { fetchPolicy: 'network-only'})

  if(loading) return <Loading />
  if(error) return <p>Error</p>
  if(!data) return <p>Error</p>

  return (
    <>
      <Header>My Profile</Header>
      {data.me && data.me.trips.length ? (
          data.me.trips.map((trip: any) => 
            <LaunchTile launch={trip} key={trip.id} />
          )
      ) : <p> No booked trip</p>}
    </>
  )
}

export default Profile;