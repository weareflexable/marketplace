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
        <Flex width={'100%'}  direction={'column'}  cursor='pointer' onClick={()=>navigateToServicePage(data.id)}>
            <Image border={'1px solid white'} borderRadius='6px'  src={'/benjamins.jpeg'} m='0' objectFit={'cover'} width='100%' height='250' alt={'Thumbnail image for cover'}/>
            <Flex px='2' mt={[4]} width={'100%'} alignItems={'center'}>
                <Avatar size={['md']} name='logo-image' src={`https://nftstorage.link/ipfs/${imageHash}`}/>
                <Flex ml={[3,3,4]} direction='column'>
                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>
                    <Text color='gray.300' textStyle={'secondary'} layerStyle={'mediumPop'}> 
                        {data.city?.charAt(0).toUpperCase()+data.city?.slice(1)}, {data.state?.toUpperCase()}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default StoreCard