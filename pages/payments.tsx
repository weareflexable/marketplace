import React,{useState, useEffect} from 'react'
import { Box, Flex, Heading, HStack, Text, VStack} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'

import {loadStripe} from '@stripe/stripe-js';
import { useCheckoutContext } from '../context/CheckoutContext';
import dayjs from 'dayjs';
import { useAuthContext } from '../context/AuthContext';
import { getPlatformPaseto } from '../utils/storage';
import { useInstantBuyContext } from '../context/InstantBuyContext';
import { getStorage } from '../utils/localStorage';
import axios from 'axios';
import Head from 'next/head';
import { usePaymentContext } from '../context/PaymentContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY||'');

const Payments = () => {
  

    const {stripePayload} = usePaymentContext()
    const [isHydrated, setIsHydrated] = useState(false)
    const [payload, setPayload] = useState<any>({})


    useEffect(()=>{
      setIsHydrated(true)
      if(isHydrated){
        setPayload(stripePayload)
      }
    },[isHydrated])

  

  return (
    <>
    
    <Head>
    {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
     <title>Payment</title>
     <link rel="icon" href="/favicon.png" />
  </Head>
    <Flex bg='gray.900' w='100' h='100vh' p='4' direction={'column'}  justifyContent='center' alignItems='center'>
      <Box w='100%' maxW={'500px'}>
          <Heading mb='8' alignSelf={'flex-start'} letterSpacing='-0.7px' color='whiteAlpha.900'>Complete payment</Heading>
      </Box>
        { stripePromise && isHydrated && payload &&
        <Elements stripe={stripePromise} options={{clientSecret: isHydrated && payload.clientSecret,appearance:{theme:'night'}}}>
            <CheckoutForm paymentIntentId={isHydrated && payload.paymentIntentId} />
        </Elements>
       }
    </Flex> 
    </>
  )
};

export default Payments


