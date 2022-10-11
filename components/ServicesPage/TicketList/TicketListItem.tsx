
import * as React from 'react';
import {
    Box,
    VStack,
} from '@chakra-ui/react'

interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string,
    id: string
}


interface ServiceProps{
    data: Service,
    onAddToCart:(id:string)=>void
}

function TicketList ({data, onAddToCart}:ServiceProps){

    return( 
        <Box border='1px solid #e5e5e5' cursor='pointer' onClick={()=>onAddToCart(data.id)}>
            {/* <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} alt={data.thumbnailAlt} width='100' height='150' /> */}
            <VStack align='left' spacing={3} p='4'>
                <Box as='h4' mb='0' lineHeight='tight' fontWeight='medium' noOfLines={1}>
                    {data.productName}
                </Box>    
                <Box>
                    ${data.price}
                    <Box as='span' color='gray.600' fontSize='sm'>
                        /person
                    </Box>
                </Box>
                <Box>
                    Avalaible tickets: {data.availableTickets}
                </Box>
            </VStack>
        </Box>
    )
}

export default TicketList