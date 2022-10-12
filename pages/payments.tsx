import React,{useState, useEffect} from 'react'
import { Flex} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'


import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_vtgL0nmkyDyenRcsGfyka7WE00WECdEnWH');


const Payments = () => {

    const [clientSecret, setClientSecret] = useState('')
  
    useEffect(()=>{
      const fetchSecret = async ()=>{
        try{
        const res = await fetch('/api/clientSecret',{
          method:'GET'
        });
        console.log(res)
        const body = await res.json()
        setClientSecret(body.clientSecret)
  
      }catch(err){
        console.log(err)
      }
      }
      fetchSecret()
    },[]);
  

  return (
    <Flex w='100' h='100vh'  justifyContent='center' alignItems='center'>
        { stripePromise && clientSecret && 
        <Elements stripe={stripePromise} options={{clientSecret}}>
            <CheckoutForm/>
        </Elements>
       }
    </Flex>
  )
};

export default Payments