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
    description: string,
    price: number
}
export default function HeroSection({logoImageHash, description, artworkHash, price, name}:Props){

    const coverImage = artworkHash && artworkHash 
    

    return(
        <Flex  w='100%' position={"relative"} direction='column'>
            <Box height='400px' border={"1px solid"} position={"relative"} maxW='100%'>
                <Image layout='fill' objectFit={'contain'} src={`https://nftstorage.link/ipfs/${coverImage}`} alt='Store header' />
            </Box>
            <Flex alignItems={'center'} mx='4' > 
                <Box mb={4} mt={9}> 
                    <Text mb={4} textStyle={'h3'} color={'accent.200'} as='h1'>${price/100}</Text>
                    <Text color={'white'} mt={3} textStyle={'h1'} as='h2' size='lg'>{name}</Text>
                    <Text mt={3} mb={9} textStyle={'body'} layerStyle={'mediumPop'}>{description}</Text>
                </Box>
            </Flex>
        </Flex>
    )
}