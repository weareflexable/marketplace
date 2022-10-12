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


interface PaymentModalProps{
  isModalOpen: boolean,
  onCloseModal: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function ProcessOrderModal({totalCost, isModalOpen, onCloseModal}:PaymentModalProps){


    const router = useRouter()
    const proceedToPayment =()=>{
      router.push('/payments')
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