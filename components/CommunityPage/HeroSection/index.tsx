import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, HStack,Text,Image, Button, IconButton, useClipboard} from '@chakra-ui/react'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'
import { useRouter } from 'next/router';
import { handleShareFacebook, handleShareLinkedIn, handleShareTwitter, handleShareWhatsapp } from '../../../utils/socialShare';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsappIcon } from '../../../customIcons';
import { AttachmentIcon, CopyIcon } from '@chakra-ui/icons';

interface Props{
    name: string,
    logoImageHash?: string,
    artworkHash: string,
    description: string,
    price: number
}
export default function HeroSection({logoImageHash, description, artworkHash, price, name}:Props){
    

    const coverImage = artworkHash && artworkHash 

    const [isLinkCopied, setIsLinkCopied] = useState(false)
    
    function copyLink(){
        navigator.clipboard.writeText('')
         // Copy the text inside the text field
         navigator.clipboard.writeText(window.location.href);
         setIsLinkCopied(true)
      } 

      useEffect(()=>{
        if(isLinkCopied){
            setTimeout(()=>{
                setIsLinkCopied(false)
            },3000)
        }
      },[isLinkCopied])


    return(
        <Flex mb={9}  w='100%' position={"relative"} direction='column'>
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
            <Flex mb={'2rem'} alignItems={['flex-start','flex-start','center','center']} direction={['column','column','row','row']}  justifyContent={'space-between'}  mx='4' > 
                <Box mt={9}> 
                    <Flex width={'100%'}>
                        <Text mb={4} textStyle={'h3'} color={'accent.200'} as='h1'>${(price/100).toLocaleString()}</Text>
                    </Flex>
                    <Text color={'white'} mt={3} textStyle={'h1'} as='h2' size='lg'>{name}</Text>
                    <Text mt={3} mb={9} textStyle={'body'} layerStyle={'mediumPop'}>{description}</Text>
                </Box>
                {/* share buttons */} 
                <HStack mb={['1rem']} spacing={3}>
                    <IconButton variant={'ghost'}  onClick={handleShareTwitter} colorScheme='brand' aria-label='twitter-share' icon={<TwitterIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'} onClick={handleShareLinkedIn}   colorScheme='brand' aria-label='linkedin-share' icon={<LinkedinIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'} onClick={handleShareWhatsapp}   colorScheme='brand' aria-label='whatsapp-share' icon={<WhatsappIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'}  onClick={handleShareFacebook} colorScheme='brand' aria-label='facebook-share' icon={<FacebookIcon color={'brand.200'}/>} />
                    <Button variant={'ghost'}  onClick={copyLink} colorScheme='brand' leftIcon={<CopyIcon/>} >{isLinkCopied? "Copied": 'Copy Link'}</Button>
                </HStack>
            </Flex>
            <Flex mx={4}  w='100' mb='1rem' direction={'column'}> 
                <Text textStyle={'h3'} mb={3} layerStyle={'highPop'}>What you get</Text>
                <Text textStyle={'body'} layerStyle={'mediumPop'}>This key gives you promotions to some to some of the venues that you otherwise wouldn't have access to</Text>
            </Flex>
        </Flex>
    )
}