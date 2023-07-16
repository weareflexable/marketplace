import React,{useState, useEffect} from 'react'
import { Box, Flex, Heading, HStack, Text, useToast, VStack} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'

import {loadStripe} from '@stripe/stripe-js';
import Head from 'next/head';
import { usePaymentContext } from '../../context/PaymentContext';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY||'');

const Payments = () => {

   const toast = useToast()
  

    const {stripePayload, setPayload:setStripePayload} = usePaymentContext()
    const [isHydrated, setIsHydrated] = useState(false)
    const {paseto} = useAuthContext()
    const [payload, setPayload] = useState<any>({})

    



    useEffect(()=>{
      async function fetchSecret(payload:any) {
        try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/payment-intents/buy-now`,payload,{
          headers:{
            'Authorization': paseto
          }
        });

        if(res.status == 200){
          const stripePayload = {
            clientSecret: res.data.clientSecret,
            paymentIntentId: res.data.payment_intent_id,
            totalAmount: localStorage.getItem('subTotal')
          }
          setPayload(stripePayload)
          setStripePayload(stripePayload) // set to context so checkout form can consume the itemTotal
        }
    
  
      }catch(err){
        toast({
          title: 'Payment Error',
          description: "Unable to complete your payment. Please try again",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:'top-right'
        })
        return err
      }
      }
      setIsHydrated(true)
      if(isHydrated){
        // check if stripe payload exists
        // if not then call function to get stripe payload
        if(stripePayload.hasOwnProperty('clientSecret')){
          setPayload(stripePayload)
        }else{
          console.log('no stripe payload')
          // fetch stripe payload here
          // get item payload from local storage
          const itemPayload = localStorage.getItem('itemPayload')
          fetchSecret(itemPayload)

        }
      }
    },[isHydrated,payload])

  

  return (
    <>
    
    <Head>
    {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
     <title>Payment</title>
     <link rel="icon" href="/favicon.png" />
  </Head>
    <Flex bg='gray.900' w='100' h='100vh' p='4' direction={'column'}  justifyContent='center' alignItems='center'>
      <Box w='100%' maxW={'500px'}>
          <Heading mb='8' alignSelf={'flex-start'} letterSpacing='-0.7px' color='whiteAlpha.900'>Complete Payment</Heading>
      </Box>
        { stripePromise && isHydrated && payload.hasOwnProperty('clientSecret') &&
        <Elements stripe={stripePromise} options={{clientSecret: isHydrated && payload.clientSecret,appearance:{theme:'night'}}}>
            <CheckoutForm paymentIntentId={isHydrated && payload.paymentIntentId} />
        </Elements>
       }
    </Flex> 
    </>
  )
};

export default Payments


