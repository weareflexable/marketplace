
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


interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void,
}

function TicketMobile ({data, onTriggerAction}:ServiceProps){

    const {
        ticketData,
        isTicketsAvailable,
        isTicketsSoldOut,
        isMinQuantity,
        ticketDate,
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
                    <Flex flex='1' justifyContent={'center'} alignItems='center'>
                         <Text mb='3' textStyle={'ticketPrice'}>${data.price/100}</Text> 
                    </Flex> 
                </Flex>
                

                {/* bottom panel */}

                <Flex px='1em' alignItems='center' justifyContent='space-between' bg='gray.800'>
                   { isTicketsAvailable? 
                   <>
                   <HStack spacing={3}  py='12px'>
                        {/* <Flex direction='column' >
                            <Text color='gray.500' mb='1'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {ticketDate}
                            </Text> 
                        </Flex> */}
                        <HStack spacing='2'>
                            <IconButton disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} color={isMinQuantity?'cyan.50':'cyan.400'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                            <Text textStyle={'caption'} color={isMinQuantity?'whiteAlpha.500':'whiteAlpha.800'}>{ticketData.quantity}</Text>
                            <IconButton onClick={incrementQuantity} size='sm' color='cyan.400' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
                        </HStack>
                        <Button disabled={isMinQuantity} size={'sm'} mr='2' onClick={buyTicketNow}>
                            <HStack spacing='2'>
                                <Text color='cyan' textStyle='caption'>Buy Now</Text> 
                                <MdAddShoppingCart size='.8em' color='cyan'/>
                            </HStack>
                        </Button>
                    <Divider orientation='vertical'/>
                    </HStack>
                    <Flex alignItems='center' justifyContent='center'>
                        {isTicketsSoldOut
                        ?<Text color={'gray.500'} textStyle={'body'}>Sold out</Text>
                        :<>
                         <HStack mr='2' spacing='1'>
                             <Text textStyle={'caption'}>{ticketData.tickets[0]!.ticketsAvailable}</Text>
                             <Text textStyle={'caption'} color='gray.500'>Tickets left</Text>
                         </HStack>
                         <HStack spacing='1'>
                            <Button onClick={()=>onTriggerAction(data.id)} color={'cyan.500'}>Add to cart</Button>
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