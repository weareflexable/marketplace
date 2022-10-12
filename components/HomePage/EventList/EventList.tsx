import React from 'react'
import {Box,Flex,Wrap,WrapItem,Badge,HStack, VStack,Image, Avatar} from '@chakra-ui/react'
// import Image from 'next/future/image'
import {Event} from '../../../data/events'
import {useRouter} from 'next/router'

interface EventListProps {
    events: Event[]
}

const EventList = ({events}:EventListProps) =>{

    return(
        <Wrap w='100%' spacing={2}> 
            {events.map(event=>(
                <WrapItem key={event.serviceId}  w='250px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
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

    const router = useRouter()
    
    const navigateToServicePage=(serviceId:string)=>{
        router.push(`/services/${serviceId}`)
    }

    return(
        <Box onClick={()=>navigateToServicePage(data.serviceId)}>
            <Image src='/assets/placeholder.jpeg'  width='100' height='150' alt={data.thumbnailAlt}/>
            <VStack align='left' spacing={3} p='4'>
                <HStack  spacing={2}>
                    <Avatar size='sm' name='Kent Dodds' src='https://bit.ly/kent-c-dodds'/>
                    <Box as='h4' lineHeight='tight' noOfLines={1}>
                        {data.juiceBar}
                    </Box>
                </HStack>
                <Box>
                    West Carolina, Florida
                </Box>
                <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase'>
                    {data.totalServices} services available
                </Box>
            </VStack>
        </Box>
    )
}

export default EventList