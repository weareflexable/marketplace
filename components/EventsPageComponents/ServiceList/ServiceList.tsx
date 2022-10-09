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


interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string,
    availableTickets: number,
    serviceType: string
}
interface EventServices {
    id?: string,
    bottleService: Array<Service>,
    lineSkip: Array<Service>
}

const services: Service[] = [
    {
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:40,
        serviceType:'lineSkip'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:45,
        serviceType:'bottleService'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description',
        availableTickets:51,
        serviceType:'lineSkip'
    }
]

interface ServiceListProps{
    // data: object
    filters: Array<string>
}

export default function ServiceList({filters}:ServiceListProps){

    
    const filterServices = (filters:Array<string>, services:Service[])=>{
            const filteredResult = services.filter((service:Service)=>{
                return filters.includes(service.serviceType)
            })
            return filteredResult;
    }

    // Using derived state to filter services
    const filteredServices = filterServices(filters, services);
    // console.log(filter)

    return(
        <>
        <Box p='1em' w='100%'  border='1px solid #e5e5e5' >
            <Heading as='h2' mb='4' size='md'>Find the right service for you</Heading>
            <ServiceSearchBar/>

            <SimpleGrid columns={2} spacing='3'>
                {filteredServices.map((service: any)=>(
                    <Service data={service}/>
                ))}

            </SimpleGrid>
        </Box>
        </>
    )
}

const Service = ({data}:any)=>{

    return( 
            <Box border='1px solid #e5e5e5' cursor='pointer' onClick={()=>console.log(data.id)}>
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