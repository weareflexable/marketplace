import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, HStack, Image,Text} from '@chakra-ui/react'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'
import { useRouter } from 'next/router';

interface StoreHeaderProps{
    storeName: string,
    city: string, 
    state: string,
    lat: number, 
    lon: number,
    street: string,
    logoImageHash: string
}
export default function StoreHeader({logoImageHash, street, storeName, city, state, lat, lon}:StoreHeaderProps){

    const coverImage = logoImageHash && logoImageHash 
    

    return(
        <Flex mt='4' w='100%' position='relative' direction='column'>
             <Box 
                height='400px'
                bgImage={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImage}`}
                backgroundPosition={'50%'} 
                backgroundSize={'cover'} 
                backgroundRepeat={'no-repeat'} 
                borderRadius={'8px'}
                width={'100%'}
                position={"relative"} 
                maxW='100%'
             > 
                <Box h={'100%'} zIndex={0} w={'100%'} bg={'rgba(255, 255, 255, .2)'} backdropFilter={'blur(17px)'} position={'absolute'} top={0} left={0}></Box>
                <Image zIndex={4} position={'absolute'} border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImage}`} m='0' maxW='100%'  objectFit={'contain'} width='100%' height='400px' alt={'Thumbnail image for cover'}/> 
            </Box>
            <Flex alignItems={'center'} p='4' w={'100%'} zIndex='6' bg={'rgba(0,0,0, 0.45)'} position='absolute' bottom='0'>
                {/* <Avatar mr='3' size='md' src={'/benjamins.jpeg'}/> */}
                <Box>
                <Text color={'white'} textStyle={'h1'} as='h1' size='lg'>{storeName}</Text>
                    <HStack width={['100%','90%','100%']} mt='1' spacing='1'>
                        {/* <MdLocationPin/>  */}
                        {/* <Link color='brand.200'  textStyle={'body'} href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477"> {city?.charAt(0).toUpperCase()+city?.slice(1)}, {state?.toUpperCase()}</Link> */}
                        <Link color='brand.200'  textStyle={'secondary'} href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}>{street}</Link>
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    )
}