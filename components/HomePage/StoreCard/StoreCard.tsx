import React from 'react'
import {Box,Flex,Text,Image, Avatar} from '@chakra-ui/react'
// import Image from 'next/future/image'
import {Store} from '../../../Types/Stores.types'
import {useRouter} from 'next/router'



interface StoreCardProps {
    data: Store
} 

export const StoreCard = ({data}:StoreCardProps) =>{

    const router = useRouter()
    
    const navigateToServicePage=(serviceId:string)=>{
        router.push(`/services/${serviceId}`)
    }

    return(
        <Box bg={'gray.700'} w='300px' onClick={()=>navigateToServicePage(data.id)}>
            <Image src='https://bit.ly/kent-c-dodds' m='0'  width='100%' height='200' alt={'Thumbnail image for cover'}/>
            <Flex p='4'>
                <Avatar size='sm' name='Kent Dodds' src='https://bit.ly/kent-c-dodds'/>
                <Flex ml='1' direction='column'>
                    <Text textStyle={'h4'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name}
                    </Text>
                    <Text color='gray.500' textStyle={'secondary'}>
                        {data.city}, {data.country}
                    </Text>
                    <Text >
                        Restaurant
                    </Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export default StoreCard