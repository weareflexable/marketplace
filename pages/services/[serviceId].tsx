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
    const [bookings, setBookings] = useState([]);


    // TODO: set filters lazily immediately after fetching services
    const [serviceFilters, setServiceFilters] = useState<Array<string>>([])

    useEffect(() => {
     const eventId = query.eventId;
     const service = eventServices.find(service=> service.id === eventId)
     setEventData(service||[])
    }, [])

    const getCurrentFilter=(value:string)=>{
        const clonedFilters = serviceFilters.slice();

        // remove filter if it exists
        if(clonedFilters.includes(value)){
           const updatedFilters = clonedFilters.filter(item=>item !== value)
           setServiceFilters(updatedFilters);
           return
        };

        // add filter if it doesn't exist
        clonedFilters.push(value);
        setServiceFilters(clonedFilters)
    }

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='0.8' h='100%' p='2'>
                    <ServiceFilter onGetFilter={getCurrentFilter}/>
                </Flex>
                <Flex h='100%' flex='2'>
                    <ServiceList filters={serviceFilters} data={eventData??eventData}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <ServiceBookings bookings={bookings}/>
                </Flex>
            </Flex>
        </Box>
    )
}