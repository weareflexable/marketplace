import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton,Input,useNumberInput, DrawerCloseButton, NumberIncrementStepper, NumberDecrementStepper, NumberInput, NumberInputField, NumberInputStepper, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, DrawerFooter} from '@chakra-ui/react'
import { Service } from '../../../../data/services'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import { useAuthContext } from '../../../../context/AuthContext'
import { useRouter } from 'next/router'

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
            <Drawer size='full' colorScheme='alphaBlack.800' placement={'right'} onClose={onCloseDrawer} isOpen={isDrawerOpen}>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader color='white'>Cart Items</DrawerHeader>
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
                        </>: <Text>Add tickets to cart</Text>
                        }
                    </Flex>
                <DrawerFooter>
                    {tickets.length>0?<CartTotalButton loginBeforePayment={loginBeforePayment} onCreateOrder={()=>onCreateOrder(totalPrice)} totalPrice={totalPrice}/>:null}
                </DrawerFooter>    
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
    
    return(
        <Flex  p='2' borderRadius='4px' mb='1' bg='blackAlpha.600' justifyContent='space-between' as='li'>
            <Flex direction='column' width='100%'>
                <Flex w='100%' justifyContent='space-between'>
                    <Text mb='2'  textStyle={'body'}>{ticket.name}</Text>
                    <IconButton onClick={()=>onRemoveTicket( ticket.id)} size='xs' icon={<MdOutlineDeleteOutline/>} aria-label='remove-item'/>
                </Flex>

                <Flex justifyContent='space-between'  width='100%' flex='1'>
                    <HStack spacing='2'>
                        <NumberInput w='150px' color='white'  size='xs' maxW={20} defaultValue={1} max={10} min={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                            <NumberIncrementStepper onClick={()=>onIncrementItemQuantity( ticket.id)}/>
                            <NumberDecrementStepper onClick={()=>onDecrementItemQuantity( ticket.id)}/>
                            </NumberInputStepper>
                        </NumberInput>
                        <Text >${ticket.price/100}</Text>
                    </HStack>
                    <Text textStyle='body'>${itemTotal}</Text>
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
        return <Button mt='3' onClick={()=>loginBeforePayment(totalPrice)} colorScheme='cyan' w='100%'>
            <Text>Login to continue</Text>
        </Button>
    }

    return(
        <Button w='100%' colorScheme='cyan' onClick={onCreateOrder} mt='3'>
            <Flex w='100%' justify='space-between' alignItems='center'>
                <Text color='gray.900' fontWeight='medium'>Book Now</Text>
                <HStack spacing={2}>
                    <Text color='GrayText' fontWeight='medium'>Total:</Text>
                    <Text  color='ButtonText' fontWeight='medium'>${totalPrice/100}</Text>
                </HStack>
            </Flex>
        </Button>
    )
}