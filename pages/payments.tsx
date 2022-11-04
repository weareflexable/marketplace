import React,{useState, useEffect} from 'react'
import { Flex} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'

import {loadStripe} from '@stripe/stripe-js';
import { useCheckoutContext } from '../context/CheckoutContext';
import dayjs from 'dayjs';
import { useAuthContext } from '../context/AuthContext';
import { getPlatformPaseto } from '../utils/storage';
import { useInstantBuyContext } from '../context/InstantBuyContext';
import { getStorage } from '../utils/localStorage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY||'');

const Payments = () => {
  
    const [clientSecret, setClientSecret] = useState('')
    const {cartItems} = useCheckoutContext();
    const {buyItems} = useInstantBuyContext();
    const {isAuthenticated} = useAuthContext()



    const createPayloadObject = (cartItems: Array<any>)=>{
        const cartDetails: Array<any> = [];
        let totalPrice = 0;
        // consider using array.map here instead of forEach
        cartItems.forEach(cart=>{
          cartDetails.push({orgServiceItemId: cart.id, quantity: cart.quantity})
          // calculate total price
          totalPrice =+ (cart.quantity*cart.price)
        })
        const payloadObject = { 
           orgServiceItems: cartDetails,
          price: totalPrice,
          date: dayjs().format('YYYY-MMM-DD')
        }
        return payloadObject
    }
  
    useEffect(()=>{
      let paseto:string|null = '';
      if(isAuthenticated){
        // paseto got set immediately after user was authenticated in in cart page
        // check if paseto has expired or not
        paseto = getPlatformPaseto()
      }
      
      const fetchSecret = async ()=>{
        let shouldBuyInstantly = getStorage('shouldBuyInstantly')
        const itemsToPurchase = shouldBuyInstantly? buyItems: cartItems 
        const payload = createPayloadObject(itemsToPurchase)
        console.log('payload',payload)
        try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/user/service-intent`,{
          method:'POST',
          body:JSON.stringify(payload),
          //@ts-ignore
          headers:{
            'Authorization': paseto
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
    <Flex bg='gray.900' w='100' h='100vh' p='4'  justifyContent='center' alignItems='center'>
        { stripePromise && clientSecret && 
        <Elements stripe={stripePromise} options={{clientSecret,appearance:{theme:'night'}}}>
            <CheckoutForm />
        </Elements>
       }
    </Flex>
  )
};

export default Payments


