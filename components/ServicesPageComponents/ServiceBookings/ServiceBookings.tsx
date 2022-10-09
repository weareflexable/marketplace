import React,{useState,useEffect} from 'react'
import {VStack,Flex,Heading,Button,Text,HStack,Box, IconButton} from '@chakra-ui/react'
import BookingList from './BookingList/BookingList'
import { Service } from '../../../data/services'

interface BookingsProps{
    bookings: Service[]
}

export default function ServiceBookings({bookings}:BookingsProps){

    function calculateBookingsTotal(bookings:Service[]){
        let total:number = 0;
        for(let service of bookings){
            total=+service.price;
        }
        return total;
    }
    const totalPrice = calculateBookingsTotal(bookings)
    console.log(totalPrice)

    return(
        <Flex  border='1px solid #e5e5e5' direction='column' w='100%' p='2'>
            <Heading as='h4' mb='3' size='sm' >Service Bookings</Heading>
            <Flex direction='column' p='3' borderEndRadius='4'  bg='#f6f6f6'>
                <BookingList>
                    {bookings.map(booking=>(
                        <BookingListItem key={booking.id} service={booking}/>
                    ))}
                    <BookingTotal/>
                </BookingList>
            </Flex>
        </Flex>
    )
}

interface BookingListItemProps{
    service: Service
}

const BookingListItem =({service}:BookingListItemProps)=>{
    return(
        <Flex p='2' borderRadius='4px' mb='1' bg="#ffffff" justifyContent='space-between' as='li'>
            <Flex direction='column'>
                <Box>
                    {service.productName}
                </Box>
                <Box>
                    ${service.price}
                </Box>
            </Flex>
            <IconButton aria-label='remove-item'/>

        </Flex>
    )
}


const BookingTotal = ()=>{
    return(
        <Button mt='3'>
            <HStack spacing={2}>
                <Text color='GrayText' fontWeight='medium'>Total:</Text>
                <Text color='ButtonText' fontWeight='medium'>$0.00</Text>
            </HStack>
        </Button>
    )
}