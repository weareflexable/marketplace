import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, Image, HStack,Text} from '@chakra-ui/react'
// import Image from 'next/image'


interface Props{
    name: string,
    logoImageHash?: string,
    coverImageHash?: string,
    artworkHash: string,
    description: string,
    price: number
}
export default function HeroSection({logoImageHash, coverImageHash, description, artworkHash, price, name}:Props){

    const coverImage = coverImageHash && coverImageHash 
    

    return(
        <Flex mb={9}  w='100%' position={"relative"} direction='column'>
            <Box 
                height='400px'
                // bgImage='/swamp-boys.jpg'
                // style={{backgroundImage:"url('/swamp-boys.jpg')", WebkitFilter:'blur(40%)'}}
                backgroundPosition={'50%'} 
                backgroundSize={'cover'} 
                backgroundRepeat={'no-repeat'} 
                border='1px solid'
               
                // border={"1px solid"} 
                filter={'blur(50%)'}
                blur={'59%'}
                width={'100%'}
                position={"relative"} 
                maxW='100%'
             >
                <Image border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash}`} m='0' maxW='100%'  objectFit={'contain'} width='100%' height='400px' alt={'Thumbnail image for cover'}/> 
                {/* <Image border={'1px solid #333333'} borderRadius='6px'  src={`/swamp-boys.jpg`} m='0' maxW='100%'  width='100%' height='400px' alt={'Thumbnail image for cover'}/>  */}
                {/* <Image layout='fill' objectFit={'contain'} src={`https://nftstorage.link/ipfs/${coverImage}`} alt='Store header' /> */}
            </Box>
            <Flex alignItems={'center'} mx='4' > 
                <Box mb={'2rem'}  mt={9}> 
                    <Text mb={4} textStyle={'h3'} color={'accent.200'} as='h1'>${price/100}</Text>
                    <Text color={'white'} mt={3} textStyle={'h1'} as='h2' size='lg'>{name}</Text>
                    <Text mt={3} mb={9} textStyle={'body'} layerStyle={'mediumPop'}>{description}</Text>
                </Box>
            </Flex>
            {/* <Flex mx={4}  w='100' mb='1rem' direction={'column'}> 
                <Text textStyle={'h3'} mb={3} layerStyle={'highPop'}>What you get</Text>
                <Text textStyle={'body'} layerStyle={'mediumPop'}>This key gives you promotions to some to some of the venues that you otherwise wouldn't have access to</Text>
            </Flex> */}
        </Flex>
    )
}