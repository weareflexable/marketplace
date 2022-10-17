import * as React from 'react';
import {Image, Flex, Box, Heading, Link} from '@chakra-ui/react'


export default function BarHeader(){
    return(
        <Flex direction='column'>
            <Box height='200px' w='100%'>
                <Image width='100%' h='100%' src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
            </Box>
            <Box>
                <Heading as='h1' size='lg'>Avery Juice Bar</Heading>
                <Link color='teal.500' href="https://www.google.com/maps/place/49%C2%B028'04.8%22N+17%C2%B006'54.5%22E/@49.4680001,17.1151401,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xe2f8df2556e9cc97!8m2!3d49.4680001!4d17.1151401">North Carolina, Ellinois</Link>
            </Box>
        </Flex>
    )
}