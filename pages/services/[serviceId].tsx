import React,{useEffect,useState} from 'react'
import {Box,Flex} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import ServiceFilter from '../../components/ServicesPageComponents/ServiceFilter/ServiceFilter'
import ServiceBookings from '../../components/ServicesPageComponents/ServiceBookings/ServiceBookings'
import ServiceList from '../../components/ServicesPageComponents/ServiceList/ServiceList'




export default function ServicesPage(){

    const {pathname, query} = useRouter()
    // const [eventData, setEventData] = useState<EventServices[]>([]);
    const [bookings, setBookings] = useState<Service[]>([]);


    // TODO: set filters lazily immediately after fetching services
    const [serviceFilters, setServiceFilters] = useState<Array<string>>([])

    // useEffect(() => {
    //  const eventId = query.eventId;
    //  const service = eventServices.find(service=> service.id === eventId)
    //  setEventData(service||[])
    // }, [])

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

    const checkBookingExist = (id:string)=>{
        const clonedBookings = bookings.slice()
        return clonedBookings.filter(booking=>booking.id === id).length>0 ? true: false;
    }
    const grabTicketHandler = (id:string)=>{

        const isBookingDuplicate = checkBookingExist(id)
        if(isBookingDuplicate) return

        const targetItem = allServices.find(service=>service.id===id);
        const clonedBookings = bookings.slice()
        clonedBookings.push(targetItem);
        console.log(clonedBookings)
        setBookings(clonedBookings);

    }

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='0.8' h='100%' p='2'>
                    <ServiceFilter onGetFilter={getCurrentFilter}/>
                </Flex>
                <Flex h='100%' flex='2'>
                    <ServiceList filters={serviceFilters} grabTicketHandler={grabTicketHandler} data={allServices}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <ServiceBookings bookings={bookings}/>
                </Flex>
            </Flex>
        </Box>
    )
}