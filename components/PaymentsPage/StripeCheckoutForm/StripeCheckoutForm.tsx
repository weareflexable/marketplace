import React,{useState,useReducer} from 'react';
import {Flex,Box,Button,Heading,HStack,useToast} from '@chakra-ui/react'
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useCheckoutContext } from '../../../context/CheckoutContext';
import { useInstantBuyContext } from '../../../context/InstantBuyContext';
import { deleteStorage } from '../../../utils/localStorage';
import { number } from 'yup';
import {numberFormatter} from '../../../utils/formatter' 
import { useRouter } from 'next/router';
import useLastVisitedPage from '../../../hooks/useLastVistedPage';

const CheckoutForm = () => {

  const {totalAmount,cartItems}=  useCheckoutContext()
  const {buyNowTotal} = useInstantBuyContext()
  const history = useLastVisitedPage()

  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast()
  const [transactionError,setTransactionError] = useState<string|undefined>('')
  const [transactionStatus, setTransactionStatus] = useState<string>('')

  // console.log(elements)
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

  function navigateBack(){
    console.log(history.lastVistitedPage)
    router.replace(`http://localhost:3001${history.lastVistitedPage}`)
  }  

  return (
  <Flex w='100' h='100vh'  justifyContent='center' alignItems='center'>
      <Box w='100%' maxW='400px'>
          <Heading mb='8' letterSpacing='-0.7px' color='whiteAlpha.900'>Complete payment</Heading>
          <form id='payment-form' onSubmit={handleSubmit}>
          <PaymentElement id='payment-element' />
          <HStack mt='5' spacing={3}>
            <Button colorScheme={'brand'} onClick={navigateBack} variant='ghost'>Cancel</Button>
            <Button colorScheme={'brand'}  type='submit' loadingText='Processing payment ...' isLoading={transactionStatus==='processing'} disabled={!stripe}>{`Pay $${buyNowTotal>0? numberFormatter.from(buyNowTotal):numberFormatter.from(totalAmount/100)}`}</Button>
          </HStack>
          </form>
      </Box>     
  </Flex>
  )
};

export default CheckoutForm