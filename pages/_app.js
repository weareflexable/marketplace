import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {CheckoutContextProvider} from '../context/CheckoutContext'
import {AuthContextProvider} from '../context/AuthContext'
import {InstantBuyContextProvider} from '../context/InstantBuyContext'
import {DatContextProvider} from '../context/DatContext'



const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   onError:(error)=>{
  //     toast({
  //       title: `Error`,
  //       position:'top',
  //       containerStyle:{
  //         width:'100%'
  //       },
  //       description: error.message,
  //       status: 'error',
  //       isClosable: true,
  //     })
  //   }
  // })
})


function MyApp({ Component, pageProps }) {

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <InstantBuyContextProvider>
                <CheckoutContextProvider>
           <DatContextProvider>
                  <ChakraProvider theme={theme}> 
                      <Component {...pageProps} />
                  </ChakraProvider>
            </DatContextProvider>
                </CheckoutContextProvider>
              <ReactQueryDevtools initialIsOpen={false} />
        </InstantBuyContextProvider>
    </QueryClientProvider>
      </AuthContextProvider> 
  ) 
}

export default MyApp
