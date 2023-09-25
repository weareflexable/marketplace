import React,{useEffect,useState} from 'react';
import { Flex, Box, Heading, Avatar, Link, HStack, Image,Text, Button, IconButton, useClipboard} from '@chakra-ui/react'
import useIpfsImage from '../../../hooks/useIpfsImage'
import {MdLocationPin} from 'react-icons/md'
import { useRouter } from 'next/router';
import { handleShareFacebook, handleShareLinkedIn, handleShareTwitter, handleShareWhatsapp } from '../../../utils/socialShare';
import { TwitterIcon, LinkedinIcon, WhatsappIcon, FacebookIcon } from '../../../customIcons';
import { CopyIcon } from '@chakra-ui/icons';

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
    
    const {value, setValue, onCopy, hasCopied} = useClipboard('')

    function handleCopyLink(){
        onCopy()
        console.log(window.location.href)
        setValue(window.location.href)
    }
    

    return(
        <Flex mt='4' w='100%' mb={5} position='relative' direction='column'>
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
            <Flex p='4' w={'100%'} zIndex='6' bg={'rgba(0,0,0, 0.45)'} position='absolute' bottom='0' alignItems={['flex-start','flex-start','center','center']} direction={['column','column','row','row']}  justifyContent={'space-between'}>
                {/* <Avatar mr='3' size='md' src={'/benjamins.jpeg'}/> */}
                <Box>
                <Text color={'white'} textStyle={'h1'} as='h1' size='lg'>{storeName}</Text>
                <HStack width={['100%','90%','100%']} mt='1' spacing='1'>
                    <Link color='brand.200'  textStyle={'secondary'} href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}>{street}</Link>
                </HStack>
                </Box>
                <HStack mt={'1rem'} spacing={3}>
                    <IconButton variant={'ghost'}  onClick={handleShareTwitter} colorScheme='brand' aria-label='twitter-share' icon={<TwitterIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'} onClick={handleShareLinkedIn}   colorScheme='brand' aria-label='linkedin-share' icon={<LinkedinIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'} onClick={handleShareWhatsapp}   colorScheme='brand' aria-label='whatsapp-share' icon={<WhatsappIcon color={'brand.200'}/>}/>
                    <IconButton variant={'ghost'}  onClick={handleShareFacebook} colorScheme='brand' aria-label='facebook-share' icon={<FacebookIcon color={'brand.200'}/>} />
                    <Button variant={'ghost'}  onClick={handleCopyLink} colorScheme='brand' leftIcon={<CopyIcon/>} >{hasCopied? "Copied": 'Copy Link'}</Button>
                </HStack>
            </Flex>
        </Flex>
    )
}