import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {CheckoutContextProvider} from '../context/CheckoutContext'
import {AuthContextProvider} from '../context/AuthContext'
import {InstantBuyContextProvider} from '../context/InstantBuyContext'
import {DatContextProvider} from '../context/DatContext'
import {PaymentContextProvider} from '../context/PaymentContext'
import {useToast} from '@chakra-ui/react'






function MyApp({ Component, pageProps }) {

  const toast = useToast()

  const queryClient = new QueryClient({
    // queryCache: new QueryCache({
    //   onError:(error)=>{
    //     const errorStatus = error.response.status
    //     if(errorStatus !== 401) return; 
    //     toast({
    //       title: `Your token has expiered`,
    //       position:'top',
    //       containerStyle:{
    //         width:'100%'
    //       },
    //       description: 'Please login again to continue',
    //       status: 'error',
    //       isClosable: true,
    //     })
    //   }
    // })
  })

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <PaymentContextProvider>
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
        </PaymentContextProvider> 
    </QueryClientProvider>
      </AuthContextProvider> 
  ) 
}

export default MyApp
