import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton,Input,useNumberInput, NumberIncrementStepper, NumberDecrementStepper, NumberInput, NumberInputField, NumberInputStepper} from '@chakra-ui/react'
import CartList from './CartList/CartList'
import { Service } from '../../../data/services'

interface CartProps{
    bookings: Service[],
    onRemoveTicket: (id: string)=>void,
    onIncrementItemQuantity: (id: string)=>void
}

export default function Cart({bookings,onRemoveTicket,onIncrementItemQuantity}:CartProps){


    function calculateCartTotal(bookings:Service[]){
        let total:number = 0;
        for(let service of bookings){
            total+=(service.price*service.quantity);
        }
      return total
    }
    
    // Used derived state, more on this content can be found
    // here >>>
    const totalPrice = calculateCartTotal(bookings)


    return(
        <Flex  border='1px solid #e5e5e5' direction='column' w='100%' p='2'>
            <Heading as='h4' mb='3' size='sm' >Service Bookings</Heading>
            <Flex direction='column' p='3' borderEndRadius='4'  bg='#f6f6f6'>
                <CartList>
                    {bookings.map(booking=>(
                        <CartListItem key={booking.id} onIncrementItemQuantity={onIncrementItemQuantity} onRemoveTicket={onRemoveTicket} service={booking}/>
                    ))}
                </CartList>
                <CartTotal totalPrice={totalPrice}/>
            </Flex>
        </Flex>
    )
}

interface CartListItemProps{
    service: Service,
    onRemoveTicket: (id: string)=>void,
    onIncrementItemQuantity: (id:string)=>void
}

const CartListItem =({service,onRemoveTicket,onIncrementItemQuantity}:CartListItemProps)=>{

    const itemTotal = service.price * service.quantity

    return(
        <Flex p='2' borderRadius='4px' mb='1' bg="#ffffff" justifyContent='space-between' as='li'>
            <Flex direction='column'>
                <Box>
                    {service.productName}
                </Box>
                <Box>
                    ${service.price}
                </Box>
                <HStack spacing='2' w='150px' maxW='220px'>
                <NumberInput  size='xs' maxW={20} onChange={()=>onIncrementItemQuantity(service.id)} defaultValue={1} max={10} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Text>${itemTotal}</Text>
                </HStack>
            </Flex>
            <IconButton onClick={()=>onRemoveTicket(service.id)} aria-label='remove-item'/>

        </Flex>
    )
}

interface CartTotalProps{
    totalPrice: number
}
const CartTotal = ({totalPrice}:CartTotalProps)=>{
    return(
        <Button mt='3'>
            <Flex w='100%' justify='space-between' alignItems='center'>
                <Text color='gray.900' fontWeight='medium'>Book Now</Text>
                <HStack spacing={2}>
                    <Text color='GrayText' fontWeight='medium'>Total:</Text>
                    <Text color='ButtonText' fontWeight='medium'>${totalPrice}</Text>
                </HStack>
            </Flex>
        </Button>
    )
}