import React from 'react'
import {Box,Flex,Wrap,WrapItem,Badge,HStack, Text, VStack,Image, Avatar} from '@chakra-ui/react'
// import Image from 'next/future/image'
import {Event} from '../../../data/events'
import {useRouter} from 'next/router'



interface EventListItemProps {
    data: Event
} 
export const EventListItem = ({data}:EventListItemProps) =>{

    const router = useRouter()
    
    const navigateToServicePage=(serviceId:string)=>{
        router.push(`/services/${serviceId}`)
    }

    return(
        <Box w='100%' onClick={()=>navigateToServicePage(data.serviceId)}>
            <Image src='https://bit.ly/kent-c-dodds' m='0'  width='100%' height='200' alt={data.thumbnailAlt}/>
            <Flex  p='4'>
                <Avatar size='sm' name='Kent Dodds' src='https://bit.ly/kent-c-dodds'/>
                <Flex ml='1' direction='column'>
                    <Text textStyle={'h4'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.juiceBar}
                    </Text>
                    <Text color='gray.500' textStyle={'secondary'}>
                        West Carolina, Florida
                    </Text>
                    <Text >
                        Restaurant
                    </Text>
                </Flex>
            </Flex>
        </Box>
    )
}
