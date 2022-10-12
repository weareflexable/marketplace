import * as React from 'react';
import {Flex,Box,Button,Heading} from '@chakra-ui/react'
import {useStripe, useElements, PaymentElement, Elements} from '@stripe/react-stripe-js';



const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://localhost:3002/myBookings",
      },
      
    });


    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
  <Flex w='100' h='100vh'  justifyContent='center' alignItems='center'>
      <Box w='400px'>
          <Heading mb='8' letterSpacing='-0.7px'>Complete payment</Heading>
          <form onSubmit={handleSubmit}>
          <PaymentElement />
          <Button mt='5' type='submit' disabled={!stripe}>Complete payment</Button>
          </form>
      </Box>     
  </Flex>
  )
};

export default CheckoutForm