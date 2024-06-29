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
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { State, WagmiProvider } from 'wagmi'
import { config, projectId } from '../config'
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})
function Web3ModalProvider({ Component, pageProps }) {
  // const queryClient = new QueryClient({})
  useEffect(()=>{
    localStorage.setItem('chakra-ui-color-mode','dark')
  })

  return ( 
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
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
      </AuthContextProvider> 
    </QueryClientProvider> 
   </WagmiProvider>
  ) 
}

export default Web3ModalProvider
