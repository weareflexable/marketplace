import React from 'react'
import {Box, Flex,Text, Avatar,Image} from '@chakra-ui/react'
// import Image from 'next/image'

import {useRouter} from 'next/router'
import { Community } from '../../../Types/Community.types'



interface CommunityCardProps {
    data: Community
} 

export const CommunityCard = ({data}:CommunityCardProps) =>{


    const router = useRouter()
    
    const navigateToCommunityPage=(communityId:string)=>{
        router.push(`/communities/${communityId}`)
    }

    const imageHash = data?.logoImageHash

    return(
        <Flex width={'100%'}  direction={'column'}  cursor='pointer' onClick={()=>navigateToCommunityPage(data.id)}>
            <Image border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`} m='0' objectFit={'cover'} width='100%' height='250' alt={'Thumbnail image for cover'}/>
            <Flex px='2' mt={[4]} width={'100%'} alignItems={'center'}>
                {/* <Avatar size={['md']} name='logo-image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}/> */}
                <Flex ml={[3,3,4]} direction='column'>
                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>
                    <Text color='gray.300' noOfLines={[1, 2, 3]} textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {data.description}
                    </Text>
                    <Text color='gray.300' mt={3} textStyle={'body'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        $&#8201;{data.price/100}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CommunityCard