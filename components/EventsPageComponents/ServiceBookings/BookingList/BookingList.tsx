import React from 'react'
import {HStack,Flex} from '@chakra-ui/react'


export default function BookingList(){
    return(
        <Flex as='ul'>
            <BookingListItem/>
        </Flex>
    )
}

const BookingListItem =()=>{
    return(
        <HStack spacing={2} as='li'>
            Booking Item
        </HStack>
    )
}

