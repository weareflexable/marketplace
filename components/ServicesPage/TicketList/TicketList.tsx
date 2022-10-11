import React from 'react'
import {
    Box,
    Wrap,
    Flex,
    WrapItem,
    Heading,
    VStack,
    HStack,
    SimpleGrid
} from '@chakra-ui/react'
import ServiceSearchBar from '../ServiceSearchBar/ServiceSearchBar'
import Image from 'next/future/image'
import TicketListItem from './TicketListItem'

interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string,
    id: string
}


interface TicketListProps{
    data: any
    filters: Array<string>,
    onAddToCart: (id:string)=>void
}

export default function TicketList({data,filters,onAddToCart}:TicketListProps){

    
    const filterServices = (filters:Array<string>, services:Service[])=>{
            const filteredResult = services.filter((service:Service)=>{
                return filters.includes(service.serviceType)
            })
            return filteredResult;
    }

    // Using derived state to filter services
    const filteredServices = filterServices(filters, data);


    return(
        <>
        <Box p='1em' w='100%'  border='1px solid #e5e5e5' >
            <Heading as='h2' mb='4' size='md'>Showing you ticket for current date</Heading>
            <ServiceSearchBar/>

            <SimpleGrid columns={1} spacing='3'>
                {filteredServices.map((service: Service)=>(
                    <TicketListItem onAddToCart={onAddToCart}  key={service.id} data={service}/>
                ))}
            </SimpleGrid>
        </Box>
        </>
    ) 
}
