import React from 'react'
import {Box, Flex,Text, Avatar,Image} from '@chakra-ui/react'
// import Image from 'next/image'
import {Store} from '../../../Types/Stores.types'
import {useRouter} from 'next/router'
import moment from 'moment'



interface StoreCardProps {
    data: Store
} 

export const StoreCard = ({data}:StoreCardProps) =>{

    const router = useRouter()
    
    const navigateToServicePage=(serviceId:string)=>{
        console.log(serviceId)
        router.push(`/services/${serviceId}?date=${moment().format('YYYY-MMM-DD')}`)
    }

    const coverImage = data?.coverImageHash
    const imageHash = data?.imageHash

    return(
        <Flex direction={'column'} bg={'gray.700'} w={['100%','340px']} maxW='340px'   cursor='pointer' onClick={()=>navigateToServicePage(data.id)}>
            <Image src={`https://nftstorage.link/ipfs/${coverImage}`} m='0' objectFit={'contain'} width='100%' height='200' alt={'Thumbnail image for cover'}/>
            {/* <Box w={'100%'} position='relative' h={'200px'}> */}
            {/* <div style={{width:'100%', position:'relative', height:'200px'}}> */}
                {/* <Image layout='fill' objectFit='cover'  src={'/testx1.png'} alt='Store header' /> */}
            {/* </div> */}
            {/* </Box> */}
            <Flex p='4'>
                <Avatar size='sm' name='logo-image' src={`https://nftstorage.link/ipfs/${imageHash}`}/>
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
        </Flex>
    )
}

export default StoreCard