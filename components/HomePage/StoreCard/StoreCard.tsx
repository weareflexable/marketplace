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
        <Box bg={'gray.700'} w={['100%', '100%', '300px']} cursor='pointer' onClick={()=>navigateToServicePage(data.id)}>
            <Image src='/benjamins.jpeg' m='0'  width='100%' height='200' alt={'Thumbnail image for cover'}/>
            <Flex p='4'>
                <Avatar size='sm' name='Kent Dodds' src='/benjamins.jpeg'/>
                <Flex ml='1' direction='column'>
                    <Text textStyle={'h4'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name}
                    </Text>
                    <Text color='gray.300' textStyle={'secondary'}>
                        {data.city?.charAt(0).toUpperCase()+data.city?.slice(1)}, {data.state?.toUpperCase()}
                    </Text>
                    <Text color='gray.300' textStyle={'secondary'} >
                        Bar
                    </Text>
                    <Text mt='3' color='cyan.300' textStyle={'secondary'} >
                        View services
                    </Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export default StoreCard