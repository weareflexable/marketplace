import React,{useState, useEffect} from 'react'
import { Flex} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'


import {loadStripe} from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../context/CheckoutContext';

const stripePromise = loadStripe('pk_test_vtgL0nmkyDyenRcsGfyka7WE00WECdEnWH');


const Payments = () => {

    const [clientSecret, setClientSecret] = useState('')
    const {totalAmount, cartItems} = useCheckoutContext()

    console.log(totalAmount)
  
    useEffect(()=>{
      const fetchSecret = async ()=>{
        const payload={
          orgServiceItems: cartItems,

        }
        try{
        const res = await fetch('https://platform.flexabledats.com/api/v1.0/services/user/service-intent',{
          method:'POST',
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
            <CheckoutForm />
        </Elements>
       }
    </Flex>
  )
};

export default Payments