
import * as React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Flex,
    Center,
    Divider,
    Heading
} from '@chakra-ui/react'

import dayjs from 'dayjs';



interface ServiceProps{
    data: any,
    onTriggerAction:(id:string)=>void
}

function TicketMobile ({data, onTriggerAction}:ServiceProps){

    const ticketIsAvailable = data.tickets.length>0;

    return( 
        <Box display={['block','block','none']} border='1px solid #e5e5e5' cursor='pointer' onClick={ticketIsAvailable?()=>onTriggerAction(data.id):()=>{}}>
            {/* <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} alt={data.thumbnailAlt} width='100' height='150' /> */}
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

                    {/* <Flex justifyContent='center' alignItems='center'  height='100%'>
                        <Divider height='50px' orientation='vertical' />
                    </Flex> */}

                    {/* price */}
                    
                </Flex>
                

                {/* bottom panel */}

                <Flex px='1em' alignItems='center' justifyContent='space-between' bg='#f7f7f7'>
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

                    <Flex alignItems='flex-start' justifyContent='center' direction='column'>
                         <Text mb='3' textStyle={'ticketPrice'}>${data.price}</Text> 
                         <HStack spacing='1'>
                             <Text textStyle={'caption'}>12</Text>
                             <Text textStyle={'caption'} color='gray.500'>Tickets left</Text>
                         </HStack>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}

export default TicketMobile