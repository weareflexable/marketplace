import React from 'react'
import {HStack,Flex,Box, Text} from '@chakra-ui/react'


export default function BookingList(){
    return(
        <Flex as='ul' w='100%'>
            <BookingListItem/>
        </Flex>
    )
}

const BookingListItem =()=>{
    return(
        <HStack spacing={2} as='li'>
            Booking Item
            <Box>
                hello worl
            </Box>
        </HStack>
    )
}

