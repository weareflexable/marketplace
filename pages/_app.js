import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {CheckoutContextProvider} from '../context/CheckoutContext'
import {AuthContextProvider} from '../context/AuthContext'
import {InstantBuyContextProvider} from '../context/InstantBuyContext'
import "antd/dist/antd.css";

const queryClient = new QueryClient()


function MyApp({ Component, pageProps }) {

  return (
    <AuthContextProvider>
        <InstantBuyContextProvider>
          <QueryClientProvider client={queryClient}>
                <CheckoutContextProvider>
                  <ChakraProvider theme={theme}> 
                      <Component {...pageProps} />
                  </ChakraProvider>
                </CheckoutContextProvider>
              <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </InstantBuyContextProvider>
      </AuthContextProvider>
  )
}

export default MyApp
