import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { LAUNCH_TILE_DATA } from '../pages/launches';
import Button from '../components/button';
import { async } from 'q';
import { cartItemsVar } from '../cache';

const BOOK_TRIPS = gql`
  mutation bookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`

const BookTrips: React.FC<any> = ({cartItems}) => {
  const [bookTrips, {loading, error, data}] = useMutation(BOOK_TRIPS, {
    variables: {
      launchIds: cartItems
    }
  });

  return data?.bookTrips?.success ? <p> {data.bookTrips.message} </p> :
   (
     <Button onClick={async() => {
       await bookTrips();
       cartItemsVar([]);
      } }>
        Book All
      </Button>
   )
}

export default BookTrips;
