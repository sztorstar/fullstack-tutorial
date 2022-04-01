import React, { Fragment, useState }  from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client'
import LaunchTile from '../components/launch-tile';
import Header from '../components/header';
import Button from '../components/button';
import Loading from '../components/loading';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

// launches(pageSize: Int!, after: String): LaunchConnection!

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String){
    launches(after: $after){
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<GetLaunchListTypes.GetLaunchList, GetLaunchListTypes.GetLaunchListVariables>(GET_LAUNCHES);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if(loading) return <Loading />
  if(error){
    console.log({error})
    return <p>Error</p>
  } 
  if(!data) return <p>Not Found</p>

  return <>
    <Header />
    {data.launches && data.launches.launches && data.launches.launches.map(launch => <LaunchTile key={launch?.id} launch={launch} />)}
    {data.launches && data.launches.hasMore && (
      isLoadingMore ? <Loading /> : <Button onClick={async() => {
        setIsLoadingMore(true);
        await fetchMore({
          variables: {
            after: data.launches.cursor
          }
        });
        setIsLoadingMore(false);
      }}>Fetch More</Button>
    )}
  </>
}

export default Launches;
