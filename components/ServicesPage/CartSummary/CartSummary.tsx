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
  } from '@chakra-ui/react'

import dayjs from 'dayjs'
import { Service } from '../../../data/services';
import { useRouter } from 'next/router';
import { useCheckoutContext } from '../../../context/CheckoutContext';
import { deleteStorage } from '../../../utils/localStorage';


interface CartSummaryProps{
  isModalOpen: boolean,
  onCloseModal: ()=>void,
  totalCost: number,
  cart: Service[]
}


  export default function CartSummary({cart, totalCost, isModalOpen, onCloseModal}:CartSummaryProps){


    const {setAmount, totalAmount,cartItems, setCart} = useCheckoutContext();
    const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
    const router = useRouter()
    
    setCart(cart)
    const proceedToPayment =()=>{
      // check user sessionsetIsProceedingToPayment(true)
      setIsProceedingToPayment(true)
      setTimeout(()=>{
        setIsProceedingToPayment(false)
        deleteStorage('shouldBuyInstantly') // clear on instances of this
        deleteStorage('cart')
        router.push('/payments');
      },3000)

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
                    <Text color="whiteAlpha.700" textStyle={'caption'}>{dayjs(item.tickets[0].date).add(5,'hours').tz('America/New_York').format('MMM DD, YYYY')}</Text>
                  </HStack>
                </Flex>
              ))}
  
           </ModalBody>
        
          <ModalFooter>
            <Button variant='ghost' disabled={isProceedingToPayment} onClick={onCloseModal}>Cancel Order</Button>
            <Button isLoading={isProceedingToPayment} loadingText={'Processing payment'} colorScheme='blue' mr={3}  onClick={proceedToPayment} >
              {`Proceed to pay $${totalAmount/100}`}
            </Button>
          </ModalFooter>
      </ModalContent>
      </Modal>
     </Flex>     
    )
  }