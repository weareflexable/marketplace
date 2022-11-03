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
    HStack,
    DrawerOverlay,
    DrawerContent,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerFooter,
    DrawerHeader,
  } from '@chakra-ui/react'


import { Service } from '../../../data/services';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../../../context/CheckoutContext';
import dayjs from 'dayjs';


interface CartSummaryProps{
  isModalOpen: boolean,
  onCloseModal: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function CartSummary({cart, totalCost, isModalOpen, onCloseModal}:CartSummaryProps){


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
       <Flex display={['flex','flex','flex','none']} w='100%'>
         <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Order summary</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
  
              {cartItems.map(item=>(
                <Flex p='1em' justifyContent={'space-between'} direction='column' alignItems='center' key={item.id}>
                  <Text mb={'4'} textStyle={'h4'} >{item.name}</Text>

                  <HStack mb='1' spacing='4'>
                    <Text color="whiteAlpha.400" textStyle={'caption'}>Unit price</Text>
                    <Text color="whiteAlpha.700" textStyle={'caption'}>${item.price/100}</Text>
                  </HStack>

                  <HStack mb='1' spacing='4'>
                    <Text color="whiteAlpha.400" textStyle={'caption'}>Quanity</Text>
                    <Text color="whiteAlpha.700" textStyle={'caption'}>x{item.quantity}</Text>
                  </HStack>

                  <HStack mb='1' spacing='4'>
                    <Text color="whiteAlpha.400" textStyle={'caption'}>Valid on</Text>
                    <Text color="whiteAlpha.700" textStyle={'caption'}>{dayjs(item.tickets[0].date).format('MMM-D-YYYY')}</Text>
                  </HStack>
                </Flex>
              ))}
  
           </ModalBody>
        
          <ModalFooter>
            <Button variant='ghost' onClick={onCloseModal}>Cancel Order</Button>
            <Button colorScheme='blue' mr={3}  onClick={proceedToPayment} >
              {`Proceed to pay $${totalAmount/100}`}
            </Button>
          </ModalFooter>
      </ModalContent>
      </Modal>
     </Flex>     
    )
  }