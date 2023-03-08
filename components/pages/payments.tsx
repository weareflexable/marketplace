import React,{useState, useEffect} from 'react'
import { Box, Flex, Heading, HStack, Text, VStack} from '@chakra-ui/react'

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../PaymentsPage/StripeCheckoutForm/StripeCheckoutForm'

import {loadStripe} from '@stripe/stripe-js';
import { useCheckoutContext } from '../../context/CheckoutContext';
import dayjs from 'dayjs';
import { useAuthContext } from '../../context/AuthContext';
import { getPlatformPaseto } from '../../utils/storage';
import { useInstantBuyContext } from '../../context/InstantBuyContext';
import { getStorage } from '../../utils/localStorage';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY||'');

const Payments = () => {
  
    const [clientSecret, setClientSecret] = useState('')
    const {cartItems} = useCheckoutContext();
    const {buyItems} = useInstantBuyContext();
    const {isAuthenticated,paseto} = useAuthContext()
    const [items,setItems] = useState({}) 


    const createPayloadObject = (cartItems: Array<any>)=>{
        const cartDetails: Array<any> = [];
        let totalPrice = 0;
        // consider using array.map here instead of forEach
        cartItems.forEach(cart=>{
          cartDetails.push({orgServiceItemId: cart.id, quantity: cart.quantity})
          // calculate total price
          totalPrice =+ (cart.quantity*cart.price)
        })
        const selectedDate = getStorage('selectedDate') ? getStorage('selectedDate') : dayjs().format('YYYY-MMM-DD')
        const payloadObject = { 
          orgServiceItems: cartDetails,
          price: totalPrice,
          date: selectedDate
        }
        return payloadObject
    }
  
    useEffect(()=>{
      // let paseto:string|null = '';
      // if(isAuthenticated){
      //   // paseto got set immediately after user was authenticated in in cart page
      //   // check if paseto has expired or not
      //   paseto = getPlatformPaseto()
      // }
      setItems(buyItems[0])
      
      const fetchSecret = async ()=>{
        let shouldBuyInstantly = getStorage('shouldBuyInstantly')
        // const itemsToPurchase = shouldBuyInstantly? buyItems: cartItems 
        // co
        // const payload = createPayloadObject(itemsToPurchase)
        const payload = buyItems[0]
        try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/payment-intents/buy-now`,payload,{
          headers:{
            'Authorization': paseto
          }
        });
    
        // console.log(res)
        setClientSecret(res.data.clientSecret)
  
      }catch(err){
        console.log(err)
        throw new Error('Error while fetching secret, try refreshing the page')
      }
      }
      fetchSecret()
    },[]);
  
    // Bring header to this page

  return (
    <Flex bg='gray.900' w='100' h='100vh' p='4' direction={'column'}  justifyContent='center' alignItems='center'>
      <Box w='100%' maxW={'500px'}>
          <Heading mb='8' alignSelf={'flex-start'} letterSpacing='-0.7px' color='whiteAlpha.900'>Complete payment</Heading>
      </Box>
      {/* { buyItems 
      ?<Flex direction={'column'} w='100%' maxW='500px'>
        <Flex mt='6' direction={'column'}>
          <Text textStyle={'body'} color='text.300'>Summary</Text>
          <VStack mt='5' border='1px solid #2b2b2b' borderRadius={'4px'} padding='4' w='100%'>
            
          </VStack>
        </Flex>
      </Flex>
      :null} */}
      {/* {!clientSecret?<Text>Loading form ...</Text>:null} */}
        { stripePromise && clientSecret &&
        <Elements stripe={stripePromise} options={{clientSecret,appearance:{theme:'night'}}}>
            <CheckoutForm />
        </Elements>
       }
    </Flex>
  )
};

export default Payments


