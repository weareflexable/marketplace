
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



interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void
}

function TicketMobile ({data, onTriggerAction}:ServiceProps){

    const ticketIsAvailable = data.tickets.length>0;

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
                   { ticketIsAvailable? 
                   <>
                   <HStack spacing={3}  py='12px'>
                        <Flex direction='column' >
                            <Text color='gray.500' mb='1'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {ticketIsAvailable?dayjs(data.tickets[0].date).format('MMM D, YYYY'):0}
                            </Text>
                        </Flex>
                        <Divider orientation='vertical'/>
                    </HStack>

                    <Flex alignItems='center' justifyContent='center'>
                         <HStack mr='2' spacing='1'>
                             <Text textStyle={'caption'}>{data.tickets[0]!.ticketsAvailable}</Text>
                             <Text textStyle={'caption'} color='gray.500'>Tickets left</Text>
                         </HStack>
                         <HStack spacing='1'>
                            <Button onClick={ticketIsAvailable?()=>onTriggerAction(data.id):()=>{}} color={'cyan.500'}>Add to cart</Button>
                         </HStack>
                    </Flex>
                    </>
                    :<Text>No ticket available on this date</Text>   }
                </Flex>
            </Flex>
        </Box>
    )
}

export default TicketMobile