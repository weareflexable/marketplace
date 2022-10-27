import React,{useEffect,useState} from 'react';
import {Image, Flex, Box, Heading, Link, HStack} from '@chakra-ui/react'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'

interface StoreHeaderProps{
    imageHash: string,
    coverImageHash:string,
    storeName: string,
    city: string, 
    lat: number, 
    lon: number
}
export default function StoreHeader({coverImageHash, storeName, city, lat, lon, imageHash}:StoreHeaderProps){

    // const {isError, isFetchingImage, imageSrc} = useIpfsImage(imageHash)

    return(
        <Flex mt='4' position='relative' direction='column'>
            <Box position='absolute' height='100%' w='100%'  bgGradient='linear(to-b, rgba(43, 43, 43, 0.1), rgba(43, 43, 43, 0.1), rgba(0, 0, 0,.9))' zIndex='2'></Box>
            <Box height='250px' w='100%'>
                <Image width='100%' h='100%' src={`https://nftstorage.link/ipfs/${coverImageHash}`} alt='Store header' />
            </Box>
            <Box p='2' zIndex='3' position='absolute' left='10' bottom='5'>
                <Heading color={'white'} textStyle={'h1'} as='h1' size='lg'>{storeName}</Heading>
                <HStack spacing='1'>
                    <MdLocationPin/>
                    <Link color='teal.500' href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477"> {city.charAt(0).toUpperCase()}, United States</Link>
                </HStack>
            </Box>
        </Flex>
    )
}