
import * as React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Flex,
    Center,
    Divider,
    Heading,
    Button
} from '@chakra-ui/react'

import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { RangePickerProps } from 'antd/lib/date-picker';



interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void
}

function TicketMobile ({data, onTriggerAction}:ServiceProps){

   // checks to see if there are available tickets for selected date
   const isTicketsAvailable = data.tickets.length>0;

   // Determines whether or not tickets are sold out
   const isTicketsSoldOut = isTicketsAvailable && data.tickets[0].ticketsAvailable < 1


   const ticketDate = isTicketsAvailable && moment(data.tickets[0].date).tz('America/New_York')

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
                        <Flex direction='column' >
                            <Text color='gray.500' mb='1'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {ticketDate.format('MMM D, YYYY')}
                            </Text> 
                        </Flex>
                        <Divider orientation='vertical'/>
                    </HStack>
                    <Flex alignItems='center' justifyContent='center'>
                        {isTicketsSoldOut
                        ?<Text color={'gray.500'} textStyle={'body'}>Sold out</Text>
                        :<>
                         <HStack mr='2' spacing='1'>
                             <Text textStyle={'caption'}>{data.tickets[0]!.ticketsAvailable}</Text>
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