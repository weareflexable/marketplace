import React,{useState,useReducer} from 'react';
import {Flex,Box,Button,Heading,Text, HStack,useToast} from '@chakra-ui/react'
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../context/CheckoutContext';
import { deleteStorage } from '../../../utils/localStorage';
import {numberFormatter} from '../../../utils/formatter' 
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';
import { usePaymentContext } from '../../../context/PaymentContext';

interface CheckoutProps{
  paymentIntentId: string
}
const CheckoutForm = ({paymentIntentId}:CheckoutProps) => {

  const {totalAmount,cartItems}=  useCheckoutContext()
  const {paseto} = useAuthContext()
  const {stripePayload} = usePaymentContext()

  // const history = useLastVisitedPage()

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast()
  const [transactionError,setTransactionError] = useState<string|undefined>('')
  const [transactionStatus, setTransactionStatus] = useState<string>('')


  const router = useRouter()

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    // clear all instant buy now in cache
    deleteStorage('shouldBuyInstantly')
    deleteStorage('selectedDate')

    setTransactionStatus('processing')
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // This will be used in dats page to determine whether or not to delay first load for 4s or not
    localStorage.setItem('comingFromPurchase','true')

    // localStorage.setItem('paymentStatus','complete')
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_ORIGIN}/dats`, // should have a userID where it can fetch booking for it
      },
    });


    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
      
      setTransactionError(result.error.message)
      setTransactionStatus('rejected')
      toast({
        title: result.error.message,
        status: 'error',
        isClosable: true,
      })
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      setTransactionStatus('approved');
      toast({
        title: 'Transaction has been approved',
        status: 'success',
        isClosable: true,
      })
      // confirm payment on server.
    }
  };

  const mutatePayment = useMutation(async(payload:any)=>{
    const data = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/cancel-payment`,payload,{
      headers:{
        'Authorization': paseto
      }
    })
    return data
  })

  const paymentMutation = mutatePayment

  function cancelTransaction(){
    const payload = {
      paymentIntentID: paymentIntentId
    }
    paymentMutation.mutate(payload,
      {
        onSuccess:()=>{ 
          const lastVisitedPage = localStorage.getItem('lastVisitedPage')
          lastVisitedPage?router.push(`${lastVisitedPage}`): router.back()
        },
      })
  }


  return (
  // <Flex w='100' h='100%' minHeight={'500px'}  justifyContent='center' alignItems='center'>
      <Box w='100%' mt='9' maxW='500px'>
        {!elements?<Text>Loading form...</Text>:null} 
          <form id='payment-form' onSubmit={handleSubmit}>
          <PaymentElement id='payment-element' />
          <HStack mt='5' spacing={3}>
            <Button colorScheme={'brand'} onClick={cancelTransaction} variant='ghost'>Cancel</Button>
            <Button colorScheme={'brand'}  type='submit' loadingText='Processing payment ...' isLoading={transactionStatus==='processing'} disabled={!stripe}>{`Pay $${numberFormatter.from(Number(localStorage.getItem('subTotal')))}`}</Button>
          </HStack>
          </form>
      </Box>     
  // </Flex>
  )
};

export default CheckoutForm