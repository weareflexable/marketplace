import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box} from '@chakra-ui/react'
import BookingList from './BookingList/BookingList'

interface BookingsProps{
    bookings: Array<{title:string, price:number}>
}

export default function ServiceBookings({bookings}:BookingsProps){

    // const bookingsCost = bookings.reduce((prev,acc)=>prev.price+acc.price) 
    return(
        <Flex direction='column' w='100%' p='2'>
            <Heading as='h4' mb='3' size='sm' >Service Bookings</Heading>
            <Flex direction='column' p='3' borderEndRadius='4'  bg='#f6f6f6'>
                <BookingList/>
                <BookingTotal/>
            </Flex>
        </Flex>
    )
}


const BookingTotal = ()=>{
    return(
        <Button>
            <HStack spacing={2}>
                <Text color='GrayText' fontWeight='medium'>Total:</Text>
                <Text color='ButtonText' fontWeight='medium'>$0.00</Text>
            </HStack>
        </Button>
    )
}