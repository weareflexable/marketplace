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
    Box,
    Stack,
    VStack,
  } from '@chakra-ui/react'


import { Service } from '../../../../data/services';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../../../../context/CheckoutContext';
import dayjs from 'dayjs';


interface MobileCartSummaryProps{
  isDrawerOpen: boolean,
  onCloseDrawer: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function MobileCartSummary({cart, totalCost, isDrawerOpen, onCloseDrawer}:MobileCartSummaryProps){



    const {setAmount, totalAmount,cartItems, setCart} = useCheckoutContext();
    const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)

    const router = useRouter()
    
    setCart(cart)
    const proceedToPayment =()=>{
      // check user session
      setIsProceedingToPayment(true)
      setTimeout(()=>{
        router.push('/payments');
        setIsProceedingToPayment(false)
      },3000)

    }

    return (
      <>
       <Drawer placement={'bottom'} size='full' onClose={onCloseDrawer} isOpen={isDrawerOpen}> 
        <DrawerOverlay />
        <DrawerContent>
         <DrawerCloseButton />
          <DrawerHeader color={'white'}>Order Summary</DrawerHeader>
          <DrawerBody>
              {cartItems.map(item=>(
                <Flex p='1em' justifyContent={'space-between'} mb='2' bg='blackAlpha.400' borderRadius={'3px'} direction='column' alignItems='center' key={item.id}>
                  <Box w='100%'>
                    <Text mb={'2'} textStyle={'h4'} >{item.name}</Text>
                  </Box>

                  <Flex w='100%' justifyContent='space-between' mb='1' >
                    <Text color="whiteAlpha.500" textStyle={'secondary'}>Unit price</Text>
                    <Text color="whiteAlpha.800" textStyle={'secondary'}>${item.price/100}</Text>
                  </Flex>

                  <Flex w='100%' justifyContent='space-between' mb='1' >
                    <Text color="whiteAlpha.500" textStyle={'secondary'}>Quantity</Text>
                    <Text color="whiteAlpha.800" textStyle={'secondary'}>x{item.quantity}</Text>
                  </Flex>

                  <Flex w='100%'  justifyContent='space-between' mb='1' >
                    <Text color="whiteAlpha.500" textStyle={'secondary'}>Valid on</Text>
                    <Text color="whiteAlpha.800" textStyle={'secondary'}>{dayjs(item.tickets[0].date).format('MMM DD, YYYY')}</Text>
                  </Flex>
                </Flex>
              ))}
          

            </DrawerBody>
            <DrawerFooter>
              <VStack w='100%'>
                <Button isLoading={isProceedingToPayment} w={'100%'} px='1em' colorScheme='cyan'   onClick={proceedToPayment} >
                {`Proceed to payment $${totalAmount/100}`}
                </Button>
                <Button w={'100%'} mt='2' variant='ghost' onClick={onCloseDrawer}>Cancel Order</Button>
              </VStack>
            </DrawerFooter>
            </DrawerContent>
            </Drawer>
       
      </>
    )
  }