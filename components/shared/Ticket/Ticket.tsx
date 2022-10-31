
import * as React from 'react';
import {
    Box,
    VStack,
    HStack,
    Skeleton,
    Text,
    Flex,
    Center,
    Divider,
    Heading,
    Button
} from '@chakra-ui/react'
import {Service} from '../../../data/services'
import dayjs from 'dayjs';
import { MdAddShoppingCart } from 'react-icons/md'
import moment from 'moment-timezone';



interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void 
}

function TicketList ({data, onTriggerAction}:ServiceProps){

    // checks to see if there are available tickets for selected date
    const isTicketsAvailable = data.tickets.length>0;

    // Determines whether or not tickets are sold out
    const isTicketsSoldOut = isTicketsAvailable && data.tickets[0].ticketsAvailable<1

    const ticketDate = isTicketsAvailable && moment(data.tickets[0].date).tz('America/New_York').format('MMM D, YYYY')

    return( 
        // <Skeleton isLoaded={!data} width='100%' height='50px'>
        <Box layerStyle={'secondLayer'} display={['none','none','block']}  cursor='pointer' >
            <Flex direction='column'>
                <Flex py='1em'>
                    <Flex px='1em' flex={7} direction='column'>
                        <Text as='h4' mb='1' textStyle={'h4'} lineHeight='tight' noOfLines={1}>
                            {data.name}
                        </Text>    
                        <Text textStyle={'secondary'}>
                            {data.description}
                        </Text>
                    </Flex>

                    {/* price */}
                    <Flex flex={3}  alignItems='center' justifyContent='center' direction='column'>
                        <Flex>
                            <Text textStyle={'ticketPrice'}>${data.price/100}</Text> 
                        </Flex>
                    </Flex>
                </Flex>
                
                <Flex bg='gray.900'  alignItems='center' justifyContent='space-between'>
                    {isTicketsAvailable?
                    <>
                    <HStack  spacing={3} px='1em'  py='12px'>
                        <HStack spacing='2' >
                            <Text color='gray.500'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {ticketDate} 
                            </Text>
                        </HStack>
                        <Divider orientation='vertical'/>

                        <Divider orientation='vertical'/>
                        <HStack spacing='2' >
                            {isTicketsSoldOut
                            ?<Text color={'gray.500'} textStyle={'body'}>Sold out</Text>
                            :<>
                                <Text color='gray.500'  textStyle={'caption'} >
                                    Tickets left 
                                </Text>
                                <Text  textStyle={'caption'}>
                                {data.tickets[0]!.ticketsAvailable}
                                </Text>
                            </>
                            }
                        </HStack>
                    </HStack>
                    <Button my='2' mr='2' onClick={()=>onTriggerAction(data.id)}>
                        <HStack spacing='2'>
                            <Text color='cyan' textStyle='caption'>Add to Cart</Text> 
                            <MdAddShoppingCart size='.8em' color='cyan'/>
                        </HStack>
                    </Button>
                        </>
                        : <Text color='gray.500' mr='2'>Ticket not available on selected date</Text>
                    }
                </Flex>
            </Flex> 
        </Box> 
    // </Skeleton>
    )
} 

export default TicketList