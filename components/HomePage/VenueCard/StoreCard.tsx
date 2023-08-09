import React from 'react'
import {Box, Flex,Text, Avatar,Image} from '@chakra-ui/react'
// import Image from 'next/image'
import {Store} from '../../../Types/Stores.types'
import {useRouter} from 'next/router'



interface StoreCardProps {
    data: Store
} 

export const StoreCard = ({data}:StoreCardProps) =>{


    const router = useRouter()
    
    const navigateToServicePage=(serviceId:string)=>{
        // console.log(serviceId)
        router.push(`/services/${serviceId}`)
    }

    const coverImage = data?.coverImageHash
    const imageHash = data?.logoImageHash

    return(
        <Flex width={'100%'}  direction={'column'}  cursor='pointer' onClick={()=>navigateToServicePage(data.id)}>
            <Image border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`} m='0' maxW='100%' width='100%' height='250' alt={'Thumbnail image for cover'}/>
            <Flex px='2' mt={[4]} width={'100%'} alignItems={'center'}>
                {/* <Avatar size={['md']} name='logo-image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}/> */}
                <Flex ml={[3,3,4]} direction='column'>
                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>
                    <Text color='gray.300' textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {data.city}, {data.state}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default StoreCard