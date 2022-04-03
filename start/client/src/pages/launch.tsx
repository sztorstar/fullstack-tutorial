import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';
import { LAUNCH_TILE_DATA } from './launches';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';
import { Header, Loading } from '../components';
import LaunchDetail from '../components/launch-detail';
import { ActionButton } from '../containers';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId){
      site
      rocket{
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`


interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({launchId}) => {
  const {error, loading, data} = useQuery<LaunchDetailsTypes.LaunchDetails, LaunchDetailsTypes.LaunchDetailsVariables>(GET_LAUNCH_DETAILS, {variables: {launchId}})
  
  if(loading) return <Loading />
  if(error) {
    console.log('<Launch> error', error)  
    return <p>Error</p>
  }
  if(!data) return <p>Not Found</p>

  return(
    <>
      <Header image={data?.launch?.mission?.missionPatch}>
        {data?.launch?.mission?.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </>
  )
}

export default Launch;
