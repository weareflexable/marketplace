import React,{useEffect,useState} from 'react'
import {Box,Flex} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {services as eventServices,EventServices} from '../../data/events'
import Header from '../../components/shared/Header/Header'
import ServiceFilter from '../../components/EventsPageComponents/ServiceFilter/ServiceFilter'
import ServiceBookings from '../../components/EventsPageComponents/ServiceBookings/ServiceBookings'
import ServiceList from '../../components/EventsPageComponents/ServiceList/ServiceList'

export default function EventPage(){

    const {pathname, query} = useRouter()
    const [eventData, setEventData] = useState<EventServices|null>(null)


    useEffect(() => {
     const eventId = query.eventId;
     const targetEvent = eventServices.find(service=> service.id === eventId)
     setEventData(targetEvent)
     console.log(targetEvent)
    }, [])

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='1' h='100vh' p='3'>
                    <ServiceFilter/>
                </Flex>
                <Flex bg='#f4f4f4' h='100vh' flex='2' p='3'>
                    ServiceListing
                    <ServiceList/>
                </Flex>
                <Flex flex='1' h='100vh' p='3'>
                    <ServiceBookings/>
                </Flex>
            </Flex>
        </Box>
    )
}