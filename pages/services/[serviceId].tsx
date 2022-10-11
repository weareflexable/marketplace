import React,{useEffect,useState} from 'react'
import {Box,Flex, Heading} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {allServices,Service} from '../../data/services'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList/TicketList'


// TODO: Rename all instances of booking(s) to cart

export default function ServicesPage(){

    // const {pathname, query} = useRouter()
    const [bookings, setBookings] = useState<Service[]>([]);

    // TODO: rename to cartItemExist
    const checkBookingExist = (id:string)=>{
        const clonedBookings = bookings.slice()
        return clonedBookings.filter(booking=>booking.id === id).length>0 ? true: false;
    }


    const addToCartHandler = (id:string)=>{

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

    const removeCartItemHandler = (id:string)=>{
        const clonedBookings = bookings.slice();
        const targetIndex = clonedBookings.findIndex(booking=>booking.id === id)
        clonedBookings[targetIndex].quantity = 0;
        const updatedBookings = clonedBookings.filter(booking=>booking.id !== id);
        setBookings(updatedBookings);
    }

    const incrementCartItemQuantity = (id: string)=>{
        const clonedBookings = bookings.slice();
        const targetItem = clonedBookings.find(booking=>booking.id === id);
        targetItem!.quantity++
        console.log(targetItem);
        setBookings(clonedBookings);
    }

    const createOrder = (cart:Service[])=>{
        // show confirmation modal
        // check if user is logged in
        // call stripe api
        // mint tokens on success
        clearCart()
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
                    <TicketList onAddToCart={addToCartHandler} services={allServices}/>
                </Flex>
                <Flex flex='1' h='100%' p='2'>
                    <Cart onIncrementCartItemQuantity={incrementCartItemQuantity} onRemoveCartItem={removeCartItemHandler} bookings={bookings}/>
                </Flex>
            </Flex>
        </Box>
    )
}