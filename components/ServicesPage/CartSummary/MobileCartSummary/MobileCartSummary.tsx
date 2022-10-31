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
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    DrawerFooter,
  } from '@chakra-ui/react'


import { Service } from '../../../../data/services';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../../../../context/CheckoutContext';


interface MobileCartSummaryProps{
  isDrawerOpen: boolean,
  onCloseDrawer: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function MobileCartSummary({cart, totalCost, isDrawerOpen, onCloseDrawer}:MobileCartSummaryProps){


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
       <Drawer placement={'bottom'} size='full' onClose={onCloseDrawer} isOpen={isDrawerOpen}> 
        <DrawerOverlay />
        <DrawerContent>
         <DrawerCloseButton />
          <DrawerHeader>Order Summary</DrawerHeader>
          <DrawerBody>
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
                    <Text color="whiteAlpha.700" textStyle={'caption'}>{item.tickets[0].date}</Text>
                  </HStack>
                </Flex>
              ))}
          

            <DrawerFooter>
            <Button mr={3} variant='ghost' onClick={onCloseDrawer}>Cancel Order</Button>
            <Button px='1em' colorScheme='blue'   onClick={proceedToPayment} >
            {`Proceed to payment  $${totalAmount/100}`}
            </Button>
            </DrawerFooter>
            </DrawerBody>
            </DrawerContent>
            </Drawer>
       
      </>
    )
  }