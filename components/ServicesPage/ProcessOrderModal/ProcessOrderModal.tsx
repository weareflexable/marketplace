import React,{useState, useEffect} from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react'
import {Elements} from '@stripe/react-stripe-js';

import StripeModal from '../StripeModal/StripeModal';
import { Service } from '../../../data/services';

import {loadStripe} from '@stripe/stripe-js';
import { json } from 'stream/consumers';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.


interface PaymentModalProps{
  isModalOpen: boolean,
  onCloseModal: ()=>void,
  totalCost: number,
  cart: Service[]
}
const stripePromise = loadStripe('pk_test_vtgL0nmkyDyenRcsGfyka7WE00WECdEnWH');


  export default function ProcessOrderModal({totalCost, isModalOpen, onCloseModal}:PaymentModalProps){

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

    const options = {
      clientSecret: '',
    };

    const [showStripeModal, setShowStripeModal] = useState(false)

    return (
      <>
        <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* <Lorem count={2} /> */}
              Modal body goes here
            </ModalBody>
  
            <ModalFooter>
              <Button variant='ghost' onClick={onCloseModal}>Cancel Order</Button>
              <Button colorScheme='blue' mr={3}  onClick={()=>{setShowStripeModal(true)}} >
                {`Proceed payment  $${totalCost}`}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       { showStripeModal? 
       stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{clientSecret}}>
        <StripeModal/>
       </Elements>):null}
       
      </>
    )
  }