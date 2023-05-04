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
export default function HeroSection({logoImageHash, price, name}:Props){

    const coverImage = logoImageHash && logoImageHash 
    

    return(
        <Flex mt='4' w='100%' position='relative' direction='column'>
            <Box height='400px' maxW='100%'>
                <Image layout='fill' objectFit={'contain'} src={`https://nftstorage.link/ipfs/${coverImage}`} alt='Store header' />
            </Box>
            <Flex alignItems={'center'} p='2' zIndex='3' position='absolute' left={['3','5']} bottom='5'>
                <Box mt={5}>
                <Text color={'white'} textStyle={'h1'} as='h1' size='lg'>{name}</Text>
                <Text color={'white'} textStyle={'h4'} as='h1' size='lg'>${price/100}</Text>
                    {/* <HStack width={['100%','90%','100%']} mt='1' spacing='1'>
                        <Text>{name}</Text>
                        <Link color='brand.200'  textStyle={'secondary'} href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}>{street}</Link>
                    </HStack> */}
                </Box>
            </Flex>
        </Flex>
    )
}