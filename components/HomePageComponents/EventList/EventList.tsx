import React from 'react'
import {Box,Flex,Wrap,WrapItem,Badge,HStack, VStack} from '@chakra-ui/react'
import Image from 'next/future/image'
import {Event} from '../../../data/events'

interface EventListProps {
    events: Event[]
}

const EventList = ({events}:EventListProps) =>{

    return(
        <Wrap spacing={5} margin={'0 auto'}> 
            {events.map(event=>(
                <WrapItem key={event.serviceID} maxW='30%' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                    <EventListItem data={event}/>
                </WrapItem>
            ))}
        </Wrap>
    )
}

interface EventListItemProps {
    data: Event
}
const EventListItem = ({data}:EventListItemProps) =>{
    return(
        <Box >
            <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} width='100' height='150' alt={data.thumbnailAlt}/>
            <VStack align='left' spacing={3} p='4'>
                <HStack spacing={3}>
                    <Badge borderRadius='full' px='2' colorScheme='teal'>
                        {data.category}
                    </Badge>
                </HStack>
                <Box as='h4' lineHeight='tight' noOfLines={1}>
                    {data.title}
                </Box>
                <Box>
                    {data.price}
                    <Box as='span' color='gray.600' fontSize='sm'>
                        /person
                    </Box>
                </Box>
                <Box mt='1' color='gray.800' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' >
                    {data.organiser}
                </Box>
                <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase'>
                    {data.totalTickets} Tickets available
                </Box>
            </VStack>
        </Box>
    )
}

export default EventList