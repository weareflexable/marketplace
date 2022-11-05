
import React,{useState,useEffect} from 'react';
import {
    Box,
    HStack,
    Skeleton,
    Text,
    Flex,
    Divider,
    Button,
    IconButton
} from '@chakra-ui/react'
import dayjs from 'dayjs';
import { MdAdd, MdAddShoppingCart, MdRemove } from 'react-icons/md'
import useTicket from './hooks/useTicket';



interface TicketProps{
    data: any,
    selectedDate: string,
    onTriggerAction:(id:string)=>void,
}

function Ticket ({data, selectedDate, onTriggerAction}:TicketProps){

    console.log('inside ticket',data)
    const {
        ticketData,
        isTicketsAvailable,
        isTicketsSoldOut,
        isMinQuantity,
        ticketDate,
        isAuthenticated,
        isProceedingToPayment,
        subTotal,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
         }= useTicket(data)

    return( 
        // <Skeleton isLoaded={!data} width='100%' height='50px'>
        <Box layerStyle={'secondLayer'} display={['none','none','block']}  cursor='pointer' >
            <Flex direction='column'>
                <Flex py='1em'>
                    <Flex px='1em' flex={7} direction='column'>
                        <Text as='h4' mb='1' textStyle={'h4'} lineHeight='tight' noOfLines={1}>
                            {ticketData.name}
                        </Text>    
                        <Text textStyle={'secondary'}>
                            {ticketData.description}
                        </Text>
                    </Flex>

                    {/* price */}
                    <Flex flex={3}  alignItems='center' justifyContent='center' direction='column'>
                        <Flex>
                            <Text textStyle={'ticketPrice'}>${ticketData.price/100}</Text> 
                        </Flex>
                        <HStack mt='2' spacing='2'>
                            <IconButton disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} color={isMinQuantity?'cyan.50':'cyan.400'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                            <Text textStyle={'caption'} color={isMinQuantity?'whiteAlpha.500':'whiteAlpha.800'}>{ticketData.quantity}</Text>
                            <IconButton onClick={incrementQuantity} size='sm' color='cyan.400'  icon={<MdAdd/>} aria-label='increment-item-quantity'/>
                        </HStack>
                    </Flex>
                </Flex>
                
                <Flex bg='gray.700'  alignItems='center' p='2' justifyContent='space-between'>
                    {isTicketsAvailable?
                    <>
                    <HStack  spacing={3} px='1em'  py='12px'>
                        <HStack spacing='2' >
                            <Text color='gray.500'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {dayjs(selectedDate).format('MMM DD, YYYY')} 
                            </Text>
                        </HStack>

                        <Divider orientation='vertical'/>
                        <HStack spacing='2' >
                            {isTicketsSoldOut
                            ?<Text color={'gray.500'} textStyle={'body'}>Sold out</Text>
                            :<>
                                <Text color='gray.500'  textStyle={'caption'} >
                                    Tickets left 
                                </Text>
                                <Text  textStyle={'caption'}>
                                {ticketData.tickets[0]!.ticketsAvailable}
                                </Text>
                            </>
                            }
                        </HStack>
                    </HStack>

                    <HStack spacing='2'>
                        <Button size={'sm'} mr='2' variant={'outline'} onClick={()=>onTriggerAction(data.id)}>
                            <HStack spacing='2'>
                                <Text color='cyan' textStyle='caption'>Add to Cart</Text> 
                                <MdAddShoppingCart size='.8em' color='cyan'/>
                            </HStack>
                        </Button>
                        <HStack mr='2' spacing={'3'}>
                            
                            <Button isLoading={isProceedingToPayment} disabled={isMinQuantity&&isAuthenticated} size={'sm'} mr='2' onClick={buyTicketNow}>
                                <HStack spacing='2'>
                                    <Text color='cyan' textStyle='caption'>{`Buy Now $${subTotal}`}</Text> 
                                </HStack>
                            </Button>
                        </HStack>
                    </HStack>
                        </>
                        : <Text color='gray.500' mr='2'>Ticket not available on selected date</Text>
                    }
                </Flex>
            </Flex> 
        </Box> 
    // </Skeleton>
    )
} 

export default Ticket