import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client';
import Loading from '../components/loading';
import Header from '../components/header';
import {CartItem, BookTrips} from '../containers'

const GET_CART = gql`
  query getCartItems {
    cartItems @client
  }

`

interface CartProps extends RouteComponentProps {

}

const Cart: React.FC<CartProps> = () => {
  const {data, loading, error} = useQuery(GET_CART);

  if(loading) return <Loading />
  if(error) return <p>Error</p>
  
  return <>
    <Header>My Cart</Header>
    {data?.cartItems?.length === 0 ? <p>No items in your cart</p> : (
      <>
        {
          data?.cartItems.map((launchId: any) => <CartItem launchId={launchId} />)
        }
        <BookTrips cartItems={data?.cartItem || []} />
      </>
    )}
  </>;
}

export default Cart;
