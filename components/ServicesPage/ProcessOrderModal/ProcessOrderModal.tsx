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


import { Service } from '../../../data/services';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../../../context/CheckoutContext';


interface PaymentModalProps{
  isModalOpen: boolean,
  onCloseModal: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function ProcessOrderModal({cart, totalCost, isModalOpen, onCloseModal}:PaymentModalProps){


    const {setAmount, setCart} = useCheckoutContext();

    const router = useRouter()
    setAmount(totalCost);
    setCart(cart)
    const proceedToPayment =()=>{
      // check user session
      // if signed in, then i can proceed
      // if not, then I redirect to app.flexable.dats
      router.push(
        {pathname:'/payments',
      })
    }

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
              <Button colorScheme='blue' mr={3}  onClick={proceedToPayment} >
                {`Proceed payment  $${totalCost}`}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       
      </>
    )
  }