import React,{useState,useReducer} from 'react';
import {Flex,Box,Button,Heading,useToast} from '@chakra-ui/react'
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../context/CheckoutContext';



const CheckoutForm = () => {

  const {totalAmount,cartItems}=  useCheckoutContext()

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast()
  const [transactionError,setTransactionError] = useState<string|undefined>('')
  const [transactionStatus, setTransactionStatus] = useState<string>('')

  console.log(elements)

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setTransactionStatus('processing')
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    localStorage.setItem('paymentStatus','complete')
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://marketplace.flexabledats.com/bookings", // should have a userID where it can fetch booking for it
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

  return (
  <Flex w='100' h='100vh'  justifyContent='center' alignItems='center'>
      <Box w='100%' maxW='400px'>
          <Heading mb='8' letterSpacing='-0.7px' color='whiteAlpha.900'>Complete payment</Heading>
          <form id='payment-form' onSubmit={handleSubmit}>
          <PaymentElement id='payment-element' />
          <Button mt='5' type='submit' isLoading={transactionStatus==='processing'} disabled={!stripe}>Complete Payment of ${totalAmount/100}</Button>
          </form>
      </Box>     
  </Flex>
  )
};

export default CheckoutForm