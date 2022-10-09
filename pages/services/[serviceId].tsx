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
    const [eventData, setEventData] = useState<EventServices|[]>([]);
    const [bookings, setBookings] = useState([])

    useEffect(() => {
     const eventId = query.eventId;
     const service = eventServices.find(service=> service.id === eventId)
     setEventData(service||[])
     console.log(service)
    }, [])

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='1' h='100%' p='2'>
                    <ServiceFilter/>
                </Flex>
                <Flex h='100vh' flex='2' p='3'>
                    <ServiceList data={eventData??eventData}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <ServiceBookings bookings={bookings}/>
                </Flex>
            </Flex>
        </Box>
    )
}