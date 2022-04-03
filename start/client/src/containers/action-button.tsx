import { useReactiveVar, gql, useMutation, Reference } from '@apollo/client';
import React from 'react';
import * as LaunchDetailsTypes from '../pages/__generated__/LaunchDetails'
import { cartItemsVar } from '../cache';
import Button from '../components/button';
import { LAUNCH_TILE_DATA } from '../pages/launches';
import { Loading } from '../components';

interface ActionButtonProps extends Partial<LaunchDetailsTypes.LaunchDetails_launch>{}

const CANCEL_TRIP = gql`
  mutation cancelTrip($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`


const CancelTripButton: React.FC<ActionButtonProps> = ({id}) => {
  const [cancelTrip, {loading, error}] = useMutation(CANCEL_TRIP, {
    variables: {
      launchId: id
    },
    update(cache, { data: { cancelTrip }}) {
      const launch = cancelTrip.launches[0];
      cache.modify({
        id: cache.identify({
          __typename: 'User',
          id: localStorage.getItem('userId')
        }),
        fields: {
          trips(existingTrips: Reference[], {readField}) {
            return existingTrips.filter(
              tripRef => readField("id", tripRef) !== launch.id
            )
          }
        }
      })
    }
  });
  
  if(loading) return <Loading />
  if(error) return <p>Error</p>
  return(
    <Button onClick={() => cancelTrip()}>
      Cancel Trip
    </Button>
  )
}

const ToggleTripButton: React.FC<ActionButtonProps> = ({id}) => {
  const cartItems = useReactiveVar(cartItemsVar);
  const isInCart = id ? cartItems.includes(id) : false;
  return (
    <Button onClick={
      () => {
        if(id){
          if(isInCart){
            cartItemsVar(cartItems.filter(itemId => itemId !== id))
          }else{
            const newCartItems = [...cartItems, id];
            cartItemsVar(newCartItems)
          }
        }
      }
    }>{isInCart ? 'Remove from cart' : 'Add to cart'}</Button>
  )
}

const ActionButton: React.FC<ActionButtonProps> = ({isBooked, id}) => {
  return isBooked ? <CancelTripButton id={id} /> : <ToggleTripButton id={id} />
}

export default ActionButton;