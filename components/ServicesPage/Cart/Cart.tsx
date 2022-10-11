import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton,Input,useNumberInput, NumberIncrementStepper, NumberDecrementStepper, NumberInput, NumberInputField, NumberInputStepper} from '@chakra-ui/react'
import CartList from './CartList/CartList'
import { Service } from '../../../data/services'

interface CartProps{
    tickets: Service[],
    onRemoveCartItem: (id: string)=>void,
    onIncrementCartItemQuantity: (id: string)=>void,
    onCreateOrder: ()=>void
}

export default function Cart({tickets,onRemoveCartItem,onIncrementCartItemQuantity,onCreateOrder}:CartProps){


    function calculateCartTotal(tickets:Service[]){
        let total:number = 0;
        for(let service of tickets){
            total+=(service.price*service.quantity);
        }
      return total      
    }
    
    const totalPrice = calculateCartTotal(tickets)


    return(
        <Flex  border='1px solid #e5e5e5' direction='column' w='100%' p='2'>
            <Heading as='h4' mb='3' size='sm' >Service Bookings</Heading>
            <Flex direction='column' p='3' borderEndRadius='4'  bg='#f6f6f6'>
                {tickets.length > 0 ? 
                <>
                    <CartList>
                        {tickets.map(ticket=>(
                            <CartListItem 
                            key={ticket.id} 
                            onIncrementItemQuantity={onIncrementCartItemQuantity} 
                            onRemoveTicket={onRemoveCartItem} 
                            ticket={ticket}
                            />
                            ))}
                    </CartList>
                    <CartTotalButton onCreateOrder={onCreateOrder} totalPrice={totalPrice}/>
                </>: <Text>Add tickets to cart</Text>
                }
            </Flex>
        </Flex>
    )
}

interface CartListItemProps{
    ticket: Service,
    onRemoveTicket: (id: string)=>void,
    onIncrementItemQuantity: (id:string)=>void,
}

const CartListItem =({ticket,onRemoveTicket,onIncrementItemQuantity}:CartListItemProps)=>{
    
    const itemTotal = ticket.price *  ticket.quantity
    
    return(
        <Flex p='2' borderRadius='4px' mb='1' bg="#ffffff" justifyContent='space-between' as='li'>
            <Flex direction='column'>
                <Box>
                    { ticket.productName}
                </Box>
                <Box>
                    ${ ticket.price}
                </Box>
                <HStack spacing='2' w='150px' maxW='220px'>
                <NumberInput  size='xs' maxW={20} onChange={()=>onIncrementItemQuantity( ticket.id)} defaultValue={1} max={10} min={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Text>${itemTotal}</Text>
                </HStack>
            </Flex>
            <IconButton onClick={()=>onRemoveTicket( ticket.id)} aria-label='remove-item'/>
        </Flex>
    )
}

interface CartTotalButtonProps{
    totalPrice: number
    onCreateOrder:()=>void;
}
const CartTotalButton = ({totalPrice,onCreateOrder}:CartTotalProps)=>{
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