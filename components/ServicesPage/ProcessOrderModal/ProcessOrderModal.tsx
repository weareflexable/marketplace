import React,{useState, useEffect} from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Flex,
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


    const {setAmount, totalAmount,cartItems, setCart} = useCheckoutContext();

    const router = useRouter()
    
    setCart(cart)
    const proceedToPayment =()=>{
      // check user session
      // if signed in, then i can proceed
      // if not, then I redirect to app.flexable.dats
      router.push('/payments');

    }

    return (
      <>
        <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Order summary</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              {cartItems.map(item=>(
                <Flex justifyContent={'space-between'} alignItems='center' key={item.id}>
                  <Text mb={'4'} textStyle={'body'} >{item.name}</Text>
                  <Text textStyle={'body'}>${totalAmount/100}</Text>
                </Flex>
              ))}
            </ModalBody>
  
            <ModalFooter>
              <Button variant='ghost' onClick={onCloseModal}>Cancel Order</Button>
              <Button colorScheme='blue' mr={3}  onClick={proceedToPayment} >
                {`Proceed payment  $${totalAmount/100}`}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       
      </>
    )
  }