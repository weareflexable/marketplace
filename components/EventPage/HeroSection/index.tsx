import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, Image, HStack,Text, Button} from '@chakra-ui/react'
import { handleShareLinkedIn, handleShareTwitter } from '../../../utils/socialShare';
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
                <Image zIndex={4} position={'absolute'} border={'1px solid #333333'} borderRadius='6px'  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash}`} m='0' maxW='100%'  objectFit={'contain'} width='100%' height='400px' alt={'Thumbnail image for cover'}/> 
            </Box>
            <Flex alignItems={'center'} justifyContent={'space-between'} mx='4' > 
                <Box mb={'2rem'}  mt={9}> 
                    <Text mb={4} textStyle={'h3'} color={'accent.200'} as='h1'>${price/100}</Text>
                    <Text color={'white'} mt={3} textStyle={'h1'} as='h2' size='lg'>{name}</Text>
                    <Text mt={3} mb={9} textStyle={'body'} layerStyle={'mediumPop'}>{description}</Text>
                </Box>
                <HStack spacing={2}>
                    <Button size={'sm'} variant={'link'} onClick={handleShareTwitter}>
                     Twitter
                    </Button>
                    <Box>•</Box>
                    <Button size={'sm'} variant={'link'} onClick={handleShareLinkedIn}>
                    Linkedin
                    </Button>
                </HStack>
            </Flex>
            {/* <Flex mx={4}  w='100' mb='1rem' direction={'column'}> 
                <Text textStyle={'h3'} mb={3} layerStyle={'highPop'}>What you get</Text>
                <Text textStyle={'body'} layerStyle={'mediumPop'}>This key gives you promotions to some to some of the venues that you otherwise wouldn't have access to</Text>
            </Flex> */}
        </Flex>
    )
}