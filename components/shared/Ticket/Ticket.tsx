
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
import {Service} from '../../../data/services'
import dayjs from 'dayjs';



interface ServiceProps{
    data: Service,
    onTriggerAction:(id:string)=>void
}

function TicketList ({data, onTriggerAction}:ServiceProps){

    console.log(data)

    return( 
        <Box border='1px solid #e5e5e5' cursor='pointer' onClick={()=>onTriggerAction(data.id)}>
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
                    <Flex flex={3}  alignItems='center' justifyContent='center' direction='column'>
                        <Text as='span' textStyle={'caption'} color='gray.500'>
                            per person
                        </Text>
                        <Flex>
                            <Text textStyle={'currency'}>$</Text> 
                            <Text textStyle={'ticketPrice'}>{data.price}</Text> 
                        </Flex>
                    </Flex>
                </Flex>
                
                <Flex px='1em' alignItems='center' justifyContent='space-between' bg='#f7f7f7'>
                    <HStack spacing={3}  py='12px'>
                        <HStack spacing={1}>
                            <Text color='gray.500'  textStyle={'caption'} >
                                Valid on 
                            </Text>
                            <Text textStyle={'caption'}>
                            {dayjs(data.tickets[0].date).format('MMM D, YYYY')}
                            </Text>
                        </HStack>

                        <HStack spacing={1}>
                            <Text color='gray.500'  textStyle={'caption'} >
                                Avalaible tickets 
                            </Text>
                            <Text textStyle={'caption'}>
                            {data.ticketMaxPerDay}
                            </Text>
                        </HStack>
                    </HStack>
                    <Flex  h='100%'>
                        <Text textStyle='caption'>Add to Cart</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}

export default TicketList