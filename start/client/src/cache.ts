import { InMemoryCache, Reference, makeVar } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                isUserLoggedIn: {
                    read() {
                        return isLoggedInVar();
                    }
                },
                cartItems: {
                    read() {
                        return cartItemsVar();
                    }
                },
                launches: {
                    keyArgs: false,
                    merge(existing, incoming) {
                        let launches: Reference[] = [];
                        if(existing?.launches){
                            launches = launches.concat(existing.launches);
                        }
                        if(incoming?.launches) {
                            launches = launches.concat(incoming.launches);
                        }
                        return {
                            ...incoming,
                            launches
                        }
                    }
                }
            }
        }
    }
});

export const isLoggedInVar = 
  makeVar<boolean>(!!localStorage.getItem('token'));

export const cartItemsVar = 
 makeVar<string[]>([]);
  