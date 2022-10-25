import React,{useState, useEffect} from 'react'
import { Flex} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'


import {loadStripe} from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../context/CheckoutContext';
import dayjs from 'dayjs';
import { STRIPE_PUBLISHABLE_KEY } from '../env';
import { useAuthContext } from '../context/AuthContext';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const Payments = () => {
  
    const [clientSecret, setClientSecret] = useState('')
    const {totalAmount, cartItems} = useCheckoutContext();
    const {isAuthenticated, setIsAuthenticated} = useAuthContext()



    const createPayloadObject = (cartItems: Array<any>)=>{
        const cartDetails: Array<any> = [];
        
        // consider using array.map here instead of forEach
        cartItems.forEach(cart=>{
          cartDetails.push({orgServiceItemId: cart.id, quantity: cart.quantity})
        })
        const payloadObject = { 
           orgServiceItems: cartDetails,
          price: totalAmount*100,
          date: dayjs().format('YYYY-MMM-D')
        }
        return payloadObject
    }
  
    useEffect(()=>{

      let paseto;
      if(isAuthenticated){
        // paseto got set immediately after user was authenticated in in cart page
        paseto = localStorage.getItem('paseto')
      }

      const fetchSecret = async ()=>{
        const payload = createPayloadObject(cartItems)
        console.log('payload',payload)
        try{
        const res = await fetch('https://platform.flexabledats.com/api/v1.0/services/user/service-intent',{
          method:'POST',
          body:JSON.stringify(payload),
          headers:{
            // replace with paseto here
            'Authorization': 'v4.local.URC2UcW0k5Xpn7PFhsjfjOu1z8sIOCWFbBOJnPxzfVOWWOusxpmBSCT1oNJ5edT4vTntsRNifEviLBk4KYrVCB5whgYpqFCSdQJ9-hACAvZ7FDtx9jgUe3aXHj_EszDQQ9WU7MLXDQTq07oK8s-v1HiMbjdW-jkMbtdVPpQ2qEXckX92BQD-uWX4dwy5gTmJfdEVpa_fi4IK_rjwVXo8i01bZ6c'
          }
        });
        const body = await res.json()
        console.log(body)
        setClientSecret(body.payload.clientSecret)
  
      }catch(err){
        console.log(err)
        throw new Error('Error while fetching secret, try refreshing the page')
      }
      }
      fetchSecret()
    },[]);
  

  return (
    <Flex bg='gray.900' w='100' h='100vh'  justifyContent='center' alignItems='center'>
        { stripePromise && clientSecret && 
        <Elements stripe={stripePromise} options={{clientSecret,appearance:{theme:'night'}}}>
            <CheckoutForm />
        </Elements>
       }
    </Flex>
  )
};

export default Payments


