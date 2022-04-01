import React from 'react';
import { gql, useMutation } from '@apollo/client';
import LoginForm from '../components/login-form';
import * as LoginTypes from './__generated__/Login';
import Loading from '../components/loading';

export default function Login() {
  const USER_LOGIN = gql`
    mutation login($email: String){
      login(email: $email){
        token
        id
      }
    }
  `

  const [login, {error, loading}] = useMutation<LoginTypes.Login, LoginTypes.LoginVariables>(USER_LOGIN, {
    onCompleted({login}){
      if(login){
        localStorage.setItem('token', login.token as string);
        localStorage.setItem('userId', login.id as string);
      }
    } 
  })

  if(loading) return <Loading />
  if(error) return <p>Login Failed</p>

  return <LoginForm login={login} />;
}
