import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, HStack,Text} from '@chakra-ui/react'
import Image from 'next/image'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'
import { useRouter } from 'next/router';

interface Props{
    name: string,
    logoImageHash?: string,
    artworkHash: string,
    price: number
}
export default function HeroSection({logoImageHash, artworkHash, price, name}:Props){

    const coverImage = artworkHash && artworkHash 
    

    return(
        <Flex mt='4' w='100%' position={"relative"} direction='column'>
            <Box height='400px' border={"1px solid"} position={"relative"} maxW='100%'>
                <Image layout='fill' objectFit={'contain'} src={`https://nftstorage.link/ipfs/${coverImage}`} alt='Store header' />
            </Box>
            <Flex alignItems={'center'} p='2' zIndex='3' >
                <Box mt={5}> 
                <Text mb={3} textStyle={'h4'} as='h1'>${price/100}</Text>
                <Text color={'white'} mt={3} textStyle={'h1'} as='h1' size='lg'>{name}</Text>
                    {/* <HStack width={['100%','90%','100%']} mt='1' spacing='1'>
                        <Text>{name}</Text>
                        <Link color='brand.200'  textStyle={'secondary'} href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}>{street}</Link>
                    </HStack> */}
                </Box>
            </Flex>
        </Flex>
    )
}