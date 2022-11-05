
import * as React from 'react';
import {
    Box,
    HStack,
    Text,
    Flex,
    Divider,
    Button,
    IconButton
} from '@chakra-ui/react'

import useTicket from '../hooks/useTicket';
import { MdAdd, MdAddShoppingCart, MdRemove } from 'react-icons/md'
import dayjs from 'dayjs';


interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void,
    selectedDate: string
}

function TicketMobile ({data,selectedDate, onTriggerAction}:ServiceProps){

    const {
        ticketData,
        isTicketsAvailable,
        isTicketsSoldOut,
        isMinQuantity,
        ticketDate,
        subTotal,
        isAuthenticated,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
         }= useTicket(data)


    return( 
        <Box display={['block','block','none']} bg='blackAlpha.700' cursor='pointer' >
            {/* <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} alt={data.thumbnailAlt} width='100' height='150' /> */}
            <Flex direction='column'>
                <Flex py='1em'>
                    <Flex px='1em' flex={4} direction='column'>
                        <Text as='h4' mb='1' textStyle={'h4'} lineHeight='tight' noOfLines={1}>
                            {data.name}
                        </Text>    
                        <Text textStyle={'secondary'}>
                            {data.description}
                        </Text>
                    </Flex>
                    <Flex mr='2' flex='1' direction='column' justifyContent={'center'} alignItems='center'>
                         <Text mb='3' textStyle={'ticketPrice'}>${data.price/100}</Text> 
                         <HStack mt='2' spacing='2'>
                            <IconButton disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} color={isMinQuantity?'cyan.50':'cyan.400'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                            <Text textStyle={'caption'} color={isMinQuantity?'whiteAlpha.500':'whiteAlpha.800'}>{ticketData.quantity}</Text>
                            <IconButton onClick={incrementQuantity} size='sm' color='cyan.400' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
                        </HStack>
                    </Flex> 
                </Flex>
                

                {/* bottom panel */}

                <Flex px='1em' py='.5em' alignItems='center' justifyContent='space-between' bg='gray.800'>
                   { isTicketsAvailable? 
                   <>
                   <HStack spacing={3}>
                        <HStack spacing='1'>
                            <Text color='gray.500' textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {dayjs(selectedDate).format('MMM DD, YYYY')} 
                            </Text> 
                        </HStack>
                    
                    </HStack>
                    <Flex alignItems='center' justifyContent='center'>
                        {isTicketsSoldOut
                        ?<Text color={'gray.500'} textStyle={'body'}>Sold out</Text>
                        :<>
                         <HStack mr='2' spacing='2'>
                             <Text textStyle={'caption'} color='gray.500'>Tickets left</Text>
                             <Text textStyle={'caption'}>{ticketData.tickets[0]!.ticketsAvailable}</Text>
                         </HStack>
                         <HStack spacing='1'>
                           <IconButton onClick={()=>onTriggerAction(data.id)} color={'cyan.400'} size='sm' icon={<MdAddShoppingCart color='cyan'/>} aria-label='remove-item'/>
                           <Button disabled={isMinQuantity&&isAuthenticated} size={'sm'} mr='2' onClick={buyTicketNow}>
                             <Text color='cyan' textStyle='caption'>{`Buy Now $${subTotal}`}</Text> 
                           </Button>
                         </HStack>
                        
                         </>  
                         }
                    </Flex>
                    </>
                    :<Text>Tickets are not available on selected date</Text>   }
                </Flex>
            </Flex>
        </Box>
    )
}

export default TicketMobile