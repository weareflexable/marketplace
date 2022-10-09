import React from 'react'
import {
    Box,
    Wrap,
    Flex,
    WrapItem,
    Heading,
    VStack,
    HStack
} from '@chakra-ui/react'
import ServiceSearchBar from '../ServiceSearchBar/ServiceSearchBar'
import Image from 'next/future/image'


interface Service{
    productName: string,
    price: string,
    thumbnail: string,
    thumbnailAlt: string
}
interface EventServices {
    id?: string,
    bottleService: Array<Service>,
    lineSkip: Array<Service>
}

const services = [
    {
        productName: 'Ted talk show',
        price: '54',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Tyler Perry',
        price: '53',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    },
    {
        productName: 'Health benefits of eating fruits',
        price: '14',
        thumbnail: 'image string',
        thumbnailAlt:'Image description'
    }
]

export default function ServiceList({data}:any){

    const bottleService = data.bottleService
    console.log(bottleService)
    console.log(typeof bottleService)

    return(
        <>
        <Box p='1em' >
            <Heading as='h2' mb='4' size='md'>Find the right service for you</Heading>
            <ServiceSearchBar/>
            <Heading mb='4' as='h5' size='sm'>Line skip</Heading>
            <Wrap spacing='3'>
                {services.map((service: any)=>(
                    <Service data={service}/>
                ))}

            </Wrap>
        </Box>
        </>
    )
}

const Service = ({data}:any)=>{

    return( 
        <WrapItem>
            <Box border='1px solid #e5e5e5' cursor='pointer' onClick={()=>console.log(data.id)}>
            <Image src='/assets/placeholder.jpeg' style={{height:'150px', width:'100%' }} alt={data.thumbnailAlt} width='100' height='150' />
            <VStack align='left' spacing={3} p='4'>
                <Box as='h4' lineHeight='tight' noOfLines={1}>
                    {data.productName}
                </Box>    
                <Box>
                    ${data.price}
                    <Box as='span' color='gray.600' fontSize='sm'>
                        /person
                    </Box>
                </Box>
            </VStack>
        </Box>
        </WrapItem>
    )
}