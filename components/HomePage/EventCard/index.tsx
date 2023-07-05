import React from 'react'
import {Box, Flex,Text, Avatar,HStack, Image} from '@chakra-ui/react'
// import Image from 'next/image'

import {useRouter} from 'next/router'
import dayjs from 'dayjs'
import { Event } from '../../../Types/Event.types'



interface EventCardProps {
    data: Event
} 

export const EventCard = ({data}:EventCardProps) =>{


    const router = useRouter()
    
    const navigateToEventsPage=(eventId:string)=>{
        router.push(`/events/${eventId}`)
    }


    const coverImageHash = data?.coverImageHash


    return(
        <Flex width={'100%'}  direction={'column'}  cursor='pointer' onClick={()=>navigateToEventsPage(data.id)}>
            <Image border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash}`} m='0' objectFit={'cover'} width='100%' height='250' alt={'Thumbnail image for cover'}/>
            {/* <Image border={'1px solid #333333'} borderRadius='6px'  src={`/swamp-boys.jpg`} m='0'  maxW='100%' width='100%' height='250' alt={'Thumbnail image for cover'}/> */}
            <Flex px='0' mt={[4]} width={'100%'} alignItems={'center'}>
                {/* <Avatar size={['md']} name='logo-image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}/> */}
                <Flex ml={[3,3,4]} direction='column'>
                    <Text textStyle={'secondary'} layerStyle={'mediumPop'} lineHeight='tight' noOfLines={2}>
                        {dayjs(data.date).format('MMM DD, YYYY')} 
                    </Text>

                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>

                    <Text color='gray.300' noOfLines={[1, 2, 3]} textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {data.description}
                    </Text>
                    
                    <Flex alignItems={'baseline'}  w={'100%'}>
                        <Text color='text.300' mt={3} textStyle={'body'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                            ${data.price/100}
                        </Text> 
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default EventCard