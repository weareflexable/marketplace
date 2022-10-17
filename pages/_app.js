import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {CheckoutContextProvider} from '../context/CheckoutContext'

const queryClient = new QueryClient()


function MyApp({ Component, pageProps }) {

  return (
    <ChakraProvider theme={theme}> 
      <QueryClientProvider client={queryClient}>
        <CheckoutContextProvider>
          <Component {...pageProps} />
        </CheckoutContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp
