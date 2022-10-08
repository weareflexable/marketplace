import React from 'react'
import {Box,Flex} from '@chakra-ui/react'


const EventList = () =>{

    return(
        <Flex flexWrap={'wrap'} maxW='800px' margin={'2em auto'}>
            <EventListItem/>
        </Flex>
    )
}

const EventListItem = () =>{
    return(
        <Box>
            Data of event goes here
        </Box>
    )
}

export default EventList