import React from 'react'
import {
    Box,
    Wrap,
    Flex,
    WrapItem
} from '@chakra-ui/react'

export default function ServiceList(){
    return(
        <Box p='2em' border='1px solid #e5e5e5'>
            <Wrap spacing={'1em'}>
                <WrapItem>
                    <Service/>
                </WrapItem>
            </Wrap>
        </Box>
    )
}

const Service = ()=>{
    return(
        <Box>
            Service card goes here
        </Box>
    )
}