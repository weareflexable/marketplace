import React from 'react'
import {Box, Flex,Text, Avatar,HStack, Image, Tag} from '@chakra-ui/react'
// import Image from 'next/image'

import {useRouter} from 'next/router'
import dayjs from 'dayjs'
import { Event } from '../../../Types/Event.types'
import { numberFormatter } from '../../../utils/formatter'

var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var advancedFormat = require('dayjs/plugin/advancedFormat')

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advancedFormat)

interface EventCardProps {
    data: Event
} 

export const EventCard = ({data}:EventCardProps) =>{



    const router = useRouter()
    
    const navigateToEventsPage=(eventId:string)=>{
        router.push(`/events/${eventId}`)
    }

    const isFree = data?.price == 0


    const coverImageHash = data?.coverImageHash


    return(
        <Flex width={'100%'}  direction={'column'} position={'relative'}  cursor='pointer' onClick={()=>navigateToEventsPage(data.id)}>
              <Box 
                height='250px'
                bgImage={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash}`}
                backgroundPosition={'50%'} 
                backgroundSize={'cover'} 
                backgroundRepeat={'no-repeat'} 
                borderRadius={'8px'}
                width={'100%'}
                position={"relative"} 
                maxW='100%'
              > 
            <Box h={'100%'} zIndex={0} w={'100%'} bg={'rgba(255, 255, 255, .2)'} backdropFilter={'blur(17px)'} position={'absolute'} top={0} left={0}></Box>
                <Image border={'1px solid #333333'} width='100%'  zIndex={4} position={'absolute'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash}`} m='0' objectFit={'contain'}  height='250px' alt={'Thumbnail image for cover'}/>
            </Box>

            {/* <Image border={'1px solid #333333'} borderRadius='6px'  src={`/swamp-boys.jpg`} m='0'  maxW='100%' width='100%' height='250' alt={'Thumbnail image for cover'}/> */}
            <Flex px='0' mt={[4]} width={'100%'} alignItems={'center'}>
                {/* <Avatar size={['md']} name='logo-image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${imageHash}`}/> */}
                <Flex ml={[3,3,4]} direction='column'>
                    <Box >
                        { data?.isVirtual 
                                ? <Tag size={'sm'} width={'fit-content'} borderRadius='3xl' variant={'subtle'} textTransform={'uppercase'} textStyle={'caption'} >
                                    Virtual
                                </Tag>
                                :null
                            }
                    </Box>
                    <HStack spacing={1}>

                    <Text textStyle={'secondary'} color={'accent.100'} lineHeight='tight' noOfLines={2}>
                        {dayjs(data.startTime).tz("UTC").format('MMM DD, YYYY h A')} {data.timeZone}
                    </Text>
                    </HStack>

                    <Text textStyle={'body'} layerStyle={'highPop'} as='h4' lineHeight='tight' noOfLines={2}>
                        {data.name} 
                    </Text>

                    <Text color='gray.300' noOfLines={[2]} textStyle={'secondary'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {data.address.country}, {data.address.state}
                    </Text>
                    
                    <Flex alignItems={'baseline'}  w={'100%'}>
                        <Text color='text.300' mt={3} textStyle={'body'} textTransform='capitalize' layerStyle={'mediumPop'}> 
                        {isFree?'Free':`$${(data.price/100).toLocaleString()}`}
                        </Text> 
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default EventCard