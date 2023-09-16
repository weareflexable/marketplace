import '../styles/globals.css'

import "@fontsource-variable/figtree"

import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {CheckoutContextProvider} from '../context/CheckoutContext'
import {AuthContextProvider} from '../context/AuthContext'
import {DatContextProvider} from '../context/DatContext'
import {PaymentContextProvider} from '../context/PaymentContext'
import { useEffect } from 'react'

 

 
function MyApp({ Component, pageProps }) {


  const queryClient = new QueryClient({})

  useEffect(()=>{
    localStorage.setItem('chakra-ui-color-mode','dark')
  })

  return ( 
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <PaymentContextProvider> 
                <CheckoutContextProvider>
           <DatContextProvider>
                  <ChakraProvider theme={theme}>      
                      <Component {...pageProps} />    
                  </ChakraProvider> 
            </DatContextProvider>   
                </CheckoutContextProvider>
              <ReactQueryDevtools initialIsOpen={false} />
        </PaymentContextProvider> 
    </QueryClientProvider>
      </AuthContextProvider> 
  ) 
}

export default MyApp
