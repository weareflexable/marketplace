import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton,Input,useNumberInput, DrawerCloseButton, NumberIncrementStepper, NumberDecrementStepper, NumberInput, NumberInputField, NumberInputStepper, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, DrawerFooter} from '@chakra-ui/react'
import { Service } from '../../../../data/services'
import {MdAdd,MdRemove} from 'react-icons/md'
import { useAuthContext } from '../../../../context/AuthContext'
import { useRouter } from 'next/router'
 import dayjs from 'dayjs'
interface MobileCartProps{
    tickets: any[],
    onRemoveCartItem: (id: string)=>void,
    onIncrementCartItemQuantity: (id: string)=>void,
    onDecrementCartItemQuantity:(id:string)=>void,
    onCreateOrder: (total:number)=>void,
    onCloseDrawer: ()=>void,
    loginBeforePayment:(total:number)=>void,
    isDrawerOpen:boolean
}

export default function MobileCart({tickets,onRemoveCartItem,onIncrementCartItemQuantity,loginBeforePayment,onDecrementCartItemQuantity,onCreateOrder,onCloseDrawer,isDrawerOpen}:MobileCartProps){


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
            <Drawer colorScheme='alphaBlack.800' placement={'right'} onClose={onCloseDrawer} isOpen={isDrawerOpen}>
                <DrawerOverlay />
                <DrawerContent>
                <Flex alignItems='center' w='100%'>
                    <DrawerHeader  flex='8' color='white'>Cart Items</DrawerHeader>
                    <DrawerCloseButton mt='2' bg={'gray.300'} />
                </Flex>

                <DrawerBody>
                    <Flex direction='column' p='1' flex='1' borderEndRadius='4' >
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
                        </>: <Text color={'whiteAlpha.600'}>Add tickets to cart</Text>
                        }
                    </Flex>
                    {tickets.length>0?<CartTotalButton loginBeforePayment={loginBeforePayment} onCreateOrder={()=>onCreateOrder(totalPrice)} totalPrice={totalPrice}/>:null}
                </DrawerBody>
                </DrawerContent>
            </Drawer>
            
        </Flex>
    )
}

interface CartListItemProps{
    ticket: any,
    onRemoveTicket: (id: string)=>void,
    onIncrementItemQuantity: (id:string)=>void,
    onDecrementItemQuantity: (id:string)=>void,
}

const CartListItem =({ticket,onRemoveTicket,onIncrementItemQuantity,onDecrementItemQuantity}:CartListItemProps)=>{
    
    const itemTotal = (ticket.price/100) *  ticket.quantity
    const isMinQuantity = ticket.quantity === 1
    console.log(ticket)
    
    return(
        <Flex  p='3' borderRadius='4px' mb='2' bg='blackAlpha.500' justifyContent='space-between' as='li'>
            <Flex direction='column' width='100%'>
                <Flex w='100%' justifyContent='space-between' mb='1' alignItems='center'>
                    <Flex direction='column'>
                        <Flex alignItems={'center'} w='100%'>
                            <Text mb={'2'} color={'whiteAlpha.600'} textStyle={'caption'} >{ticket.venue}</Text>
                            <Text mb={'2'} ml='1' color={'whiteAlpha.600'} textStyle={'caption'} > · {dayjs(ticket.tickets[0].date).add(5,'hours').tz('America/New_York').format("MMM DD, YYYY")}</Text>
                        </Flex>
                        <Text mb={'2'} textStyle={'h4'} >{ticket.name}</Text>
                    </Flex>
                    <Button variant='link' fontSize={'12px'} color='red.400' onClick={()=>onRemoveTicket(ticket.id)} textStyle={'caption'}>Delete</Button>

                </Flex>

                <Flex justifyContent='space-between' alignItems={'center'}  width='100%' flex='1'>
                    <HStack spacing='2'>
                        <HStack spacing='2'>
                            <IconButton disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:()=>onDecrementItemQuantity( ticket.id)} color={isMinQuantity?'cyan.50':'cyan.400'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                            <Text textStyle={'caption'}>{ticket.quantity}</Text>
                            <IconButton onClick={()=>onIncrementItemQuantity( ticket.id)} size='sm' color='cyan.400' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
                        </HStack>
                        <Text color='whiteAlpha.600' >${ticket.price/100}</Text>
                    </HStack>
                    <Text textStyle='secondary' color='whiteAlpha.900'>${itemTotal}</Text>
                </Flex>
            </Flex>
            
        </Flex>
    )
}

interface CartTotalButtonProps{
    totalPrice: number
    onCreateOrder:()=>void
    loginBeforePayment:(total:number)=>void,
}
const CartTotalButton = ({loginBeforePayment,totalPrice,onCreateOrder}:CartTotalButtonProps)=>{

    const {isAuthenticated} = useAuthContext()

    if(!isAuthenticated){
        return <Button  onClick={()=>loginBeforePayment(totalPrice)} colorScheme='cyan' w='100%'>
            <Text>Login to continue</Text>
        </Button>
    }

    return(
        <Button w='100%' colorScheme='cyan' onClick={onCreateOrder} mt='3'>
            <Flex w='100%' justify='space-between' alignItems='center'>
                <HStack spacing={1}>
                    <Text color='GrayText' fontWeight='medium'>Total:</Text>
                    <Text  color='ButtonText' fontWeight='medium'>${totalPrice/100}</Text>
                </HStack>
                Proceed to checkout
            </Flex>
        </Button>
    )
}