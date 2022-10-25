import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton,Input,useNumberInput, NumberIncrementStepper, NumberDecrementStepper, NumberInput, NumberInputField, NumberInputStepper} from '@chakra-ui/react'
import CartList from '../CartList/CartList'
import { Service } from '../../../../data/services'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import { useAuthContext } from '../../../../context/AuthContext'

interface MobileCartProps{
    tickets: Service[],
    onRemoveCartItem: (id: string)=>void,
    onIncrementCartItemQuantity: (id: string)=>void,
    onDecrementCartItemQuantity:(id:string)=>void,
    onCreateOrder: (total:number)=>void
}

export default function MobileCart({tickets,onRemoveCartItem,onIncrementCartItemQuantity,onDecrementCartItemQuantity,onCreateOrder}:MobileCartProps){


    function calculateCartTotal(tickets:Service[]){
        let total:number = 0;
        for(let service of tickets){
            total+=(service.price*service.quantity);
        }
      return total      
    }
    
    const totalPrice = calculateCartTotal(tickets)


    return(
        <Flex mt='1em' flex='1' width='100%' direction='column'>
            <Text ml='1em' textStyle={'h4'} as='h4' mb='3'>Cart</Text>
            <Flex direction='column' p='3' flex='1' borderEndRadius='4' >
                {tickets.length > 0 ? 
                <>
                    <Flex as='ul' direction='column' flex='1' w='100%'>
                        {tickets.map(ticket=>(
                            <CartListItem 
                            key={ticket.id} 
                            onIncrementItemQuantity={onIncrementCartItemQuantity} 
                            onDecrementItemQuantity={onDecrementCartItemQuantity}
                            onRemoveTicket={onRemoveCartItem} 
                            ticket={ticket}
                            />
                            ))}
                    </Flex>
                    <CartTotalButton onCreateOrder={()=>onCreateOrder(totalPrice)} totalPrice={totalPrice}/>
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
    onDecrementItemQuantity: (id:string)=>void,
}

const CartListItem =({ticket,onRemoveTicket,onIncrementItemQuantity,onDecrementItemQuantity}:CartListItemProps)=>{
    
    const itemTotal = ticket.price *  ticket.quantity
    
    return(
        <Flex display={['none','none','flex']} p='2' borderRadius='4px' mb='1' bg='blackAlpha.600' justifyContent='space-between' as='li'>
            <Flex direction='column' width='100%'>
                <Flex w='100%' justifyContent='space-between'>
                    <Text mb='2' textStyle={'body'}>{ticket.name}</Text>
                    <IconButton onClick={()=>onRemoveTicket( ticket.id)} size='xs' icon={<MdOutlineDeleteOutline/>} aria-label='remove-item'/>
                </Flex>

                <Flex justifyContent='space-between'  width='100%' flex='1'>
                    <HStack spacing='1'>
                        <NumberInput w='150px'  size='xs' maxW={20} defaultValue={1} max={10} min={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                            <NumberIncrementStepper onClick={()=>onIncrementItemQuantity( ticket.id)}/>
                            <NumberDecrementStepper onClick={()=>onDecrementItemQuantity( ticket.id)}/>
                            </NumberInputStepper>
                        </NumberInput>
                        <Text>${ticket.price}</Text>
                    </HStack>
                    <Text>${itemTotal}</Text>
                </Flex>
            </Flex>
            
        </Flex>
    )
}

interface CartTotalButtonProps{
    totalPrice: number
    onCreateOrder:()=>void;
}
const CartTotalButton = ({totalPrice,onCreateOrder}:CartTotalButtonProps)=>{

    const {isAuthenticated,setIsAuthenticated} = useAuthContext()

    if(!isAuthenticated){
        return <Button mt='3' onClick={()=>setIsAuthenticated(true)} colorScheme='cyan' w='100%'>
            <Text>Login to continue</Text>
        </Button>
    }

    return(
        <Button colorScheme='cyan' onClick={onCreateOrder} mt='3'>
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