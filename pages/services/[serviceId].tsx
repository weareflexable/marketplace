import React,{useEffect,useState} from 'react'
import {Box,Flex, Heading} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import ServiceFilter from '../../components/ServicesPageComponents/ServiceFilter/ServiceFilter'
import ServiceBookings from '../../components/ServicesPageComponents/Cart/Cart'
import ServiceList from '../../components/ServicesPageComponents/TicketList/TicketList'


// TODO: Rename all instances of booking(s) to cart

export default function ServicesPage(){

    const {pathname, query} = useRouter()
    // const [eventData, setEventData] = useState<EventServices[]>([]);
    const [bookings, setBookings] = useState<Service[]>([]);


    // TODO: set filters lazily immediately after fetching services
    const [serviceFilters, setServiceFilters] = useState<Array<string>>(()=>['lineSkip','bottleService'])

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

    // TODO: rename to cartItemExist
    const checkBookingExist = (id:string)=>{
        const clonedBookings = bookings.slice()
        return clonedBookings.filter(booking=>booking.id === id).length>0 ? true: false;
    }

    // TODO: rename to addItemToCart
    const grabTicketHandler = (id:string)=>{

        // dont duplicate items in cart
        const isBookingDuplicate = checkBookingExist(id)
        if(isBookingDuplicate) return
  
        const targetTicket = allServices.find(service=>service.id===id);
        targetTicket!.quantity = 1;
        const clonedBookings = bookings.slice();
        clonedBookings.push(targetTicket);
        console.log(clonedBookings)
        setBookings(clonedBookings);

    }

    // TODO: rename to removeItemFromCart
    const removeTicketHandler = (id:string)=>{
        const clonedBookings = bookings.slice();
        const targetIndex = clonedBookings.findIndex(booking=>booking.id === id)
        clonedBookings[targetIndex].quantity = 0;
        const updatedBookings = clonedBookings.filter(booking=>booking.id !== id);
        setBookings(updatedBookings);
    }

    // TODO: rename to incrementCartItemQuantity
    const incrementItemQuantity = (id: string)=>{
        const clonedBookings = bookings.slice();
        const targetItem = clonedBookings.find(booking=>booking.id === id);
        targetItem!.quantity++
        console.log(targetItem);
        setBookings(clonedBookings);
    }

    const createOrder = (cart:Service[])=>{
        updateInventory(cart);
        clearCart()
    }

    const updateInventory = (cart:Service[])=>{
        cart.forEach(item=>{
            const target = allServices.find(service=>service.id === item.id)
            // update card inventory 
            target!.availableTickets -= item.quantity
        })
    }
    const clearCart = ()=>{
        setBookings([]);
    }

    return(
        <Box>
            <Header/>
            <Flex>
                <Flex flex='0.8' h='100%' p='2'>
                </Flex>
                <Flex h='100%' direction='column'  flex='2'>
                    <Heading as='h1' mb='2' size='lg'>Avery Juice Bar</Heading>
                    <ServiceList filters={serviceFilters} grabTicketHandler={grabTicketHandler} data={allServices}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <ServiceBookings onIncrementItemQuantity={incrementItemQuantity} onRemoveTicket={removeTicketHandler} bookings={bookings}/>
                </Flex>
            </Flex>
        </Box>
    )
}