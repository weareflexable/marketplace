import React from 'react'
import {Box, Flex,Text, Avatar,HStack, Image} from '@chakra-ui/react'
// import Image from 'next/image'

import {useRouter} from 'next/router'
import { Community } from '../../../Types/Community.types'
import { numberFormatter } from '../../../utils/formatter'



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
              <Box 
                height='250px'
                bgImage={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}
                backgroundPosition={'50%'} 
                backgroundSize={'cover'}  
                backgroundRepeat={'no-repeat'} 
                borderRadius={'8px'}
                width={'100%'}
                position={"relative"} 
                maxW='100%'
              > 
                <Box h={'100%'} zIndex={0} w={'100%'} bg={'rgba(255, 255, 255, .2)'} backdropFilter={'blur(17px)'} position={'absolute'} top={0} left={0}>
                    <Image border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}  m='0' objectFit={'contain'}  width='100%' height='250' alt={'Thumbnail image for cover'}/>
                </Box>
              </Box>
            <Flex px='0' mt={[4]} width={'100%'} alignItems={'center'}>
                {/* <Avatar size={['md']} name='logo-image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}/> */}
                <Flex ml={[3,3,4]} direction='column'>
                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>
                    <Text color='gray.300' noOfLines={[1, 2, 3]} textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {data.description}
                    </Text>
                    <Flex alignItems={'baseline'}  w={'100%'}>
                        <Text mr='2' color='text.200' textDecoration={'line-through'} textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                            ${data.totalMarketValue/100} Market Value
                        </Text>
                        <Text color='text.300' mt={3} textStyle={'body'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                            {`$${numberFormatter.from(data.price/100)}`}
                        </Text> 
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CommunityCard