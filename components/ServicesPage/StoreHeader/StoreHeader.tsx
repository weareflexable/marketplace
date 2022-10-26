import React,{useEffect,useState} from 'react';
import {Image, Flex, Box, Heading, Link, HStack} from '@chakra-ui/react'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'

interface StoreHeaderProps{
    imageHash: string,
    storeName: string,
    city: string, 
    lat: number, 
    lon: number
}
export default function StoreHeader({storeName, city, lat, lon, imageHash}:StoreHeaderProps){

    // const {isError, isFetchingImage, imageSrc} = useIpfsImage(imageHash)

    return(
        <Flex mt='4' position='relative' direction='column'>
            <Box position='absolute' height='100%' w='100%'  bgGradient='linear(to-b, rgba(43, 43, 43, 0.1), rgba(43, 43, 43, 0.1), rgba(0, 0, 0,.9))' zIndex='2'></Box>
            <Box height='250px' w='100%'>
                <Image width='100%' h='100%' src='/benjamins.jpeg' alt='Dan Abramov' />
            </Box>
            <Box p='2' zIndex='3' position='absolute' left='10' bottom='5'>
                <Heading color={'white'} textStyle={'h1'} as='h1' size='lg'>{storeName}</Heading>
                <HStack spacing='1'>
                    <MdLocationPin/>
                    <Link color='teal.500' href="https://www.google.com/maps/place/49%C2%B028'04.8%22N+17%C2%B006'54.5%22E/@49.4680001,17.1151401,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0xe2f8df2556e9cc97!8m2!3d49.4680001!4d17.1151401">{city}, United States</Link>
                </HStack>
            </Box>
        </Flex>
    )
}