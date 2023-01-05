import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, HStack,Text} from '@chakra-ui/react'
import Image from 'next/image'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'
import { useRouter } from 'next/router';

interface StoreHeaderProps{
    coverImageHash:string,
    storeName: string,
    city: string, 
    state: string,
    lat: number, 
    lon: number
}
export default function StoreHeader({coverImageHash, storeName, city, state, lat, lon}:StoreHeaderProps){

    const cover = coverImageHash && coverImageHash 
    

    return(
        <Flex mt='4' w='100%' position='relative' direction='column'>
            <Box position='absolute' height='100%' w='100%'  bgGradient='linear(to-b, rgba(43, 43, 43, 0.1), rgba(43, 43, 43, 0.1), rgba(0, 0, 0,.9))' zIndex='2'></Box>
            <Box height='400px' maxW='100%'>
                <Image layout='fill' objectFit={'contain'} src={`https://nftstorage.link/ipfs/${cover}`} alt='Store header' />
                {/* <Image w='999vw' h='9999vh' maxW='100%' maxH='100%' overflow={'hidden'} objectFit={'cover'}   src={'/test1.png'} alt='Store header' /> */}
                {/* <Image layout='fill' width={100} height={100} objectFit='cover'  src={'/testx1.png'} alt='Store header' /> */}
            </Box>
            <Flex alignItems={'center'} p='2' zIndex='3' position='absolute' left={['3','5']} bottom='5'>
                <Avatar mr='3' size='md' src={'/benjamins.jpeg'}/>
                <Box>
                <Text color={'white'} textStyle={'h1'} as='h1' size='lg'>{storeName}</Text>
                    <HStack mt='1' spacing='1'>
                        <MdLocationPin/>
                        <Link color='brand.200'  textStyle={'body'} href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477"> {city?.charAt(0).toUpperCase()+city?.slice(1)}, {state?.toUpperCase()}</Link>
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    )
}