import React from 'react'
import {VStack,Heading,Button,Text,HStack} from '@chakra-ui/react'
import BookingList from './BookingList/BookingList'

export default function ServiceBookings(){
    return(
        <VStack>
            <Heading as='h4' size='lg' >Bookings</Heading>
            <BookingList/>
            <BookingTotal/>
        </VStack>
    )
}


const BookingTotal = ()=>{
    return(
        <Button>
            <HStack spacing={1}>
                <Text color='GrayText' fontWeight='medium'>Total:</Text>
                <Text color='ButtonText' fontWeight='medium'>Total:</Text>
            </HStack>
        </Button>
    )
}