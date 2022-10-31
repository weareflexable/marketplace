import {useEffect} from 'react'
import { Modal, Text, Box, DrawerCloseButton, Skeleton, Flex, HStack, VStack, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Divider } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import Image from 'next/image'


interface QrCodeMobileProps{
    isDrawerOpen: boolean,
    onCloseDrawer: ()=>void,
    isGeneratingCode: boolean,
    qrValue: any
}

const QrCodeMobile = ({isGeneratingCode, qrValue, isDrawerOpen, onCloseDrawer}:QrCodeMobileProps)=>{

    return(
<Flex display={['flex','flex','flex','none']} w='100%'>
    <Drawer placement={'bottom'} size='full' onClose={onCloseDrawer} isOpen={isDrawerOpen}> 
        <DrawerOverlay />
        <DrawerContent>
         <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Your Digital access token</DrawerHeader>
          <DrawerBody>
          <VStack spacing='2'>

                  <Image width={600} objectFit='fill' height={250} src='/haloween.jpeg' alt='An image of the nft token'/>

                <Skeleton w='100%' isLoaded={!isGeneratingCode}>
                  <Flex my='4' w='100%' direction='column'>
                    <HStack w='100%' spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Location:</Text>
                      <Text color='cyan.700' textStyle={'caption'}> 
                        <a href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477">314 S Franklin St Syracuse, NY 13206</a> 
                      </Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Call:</Text>
                      <Text color='cyan.700' textStyle={'caption'}> <a href="tel:+1-315-299-4756">+1 (315) 299-4756</a></Text>
                    </HStack>


                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Quantity:</Text>
                      {/* @ts-ignore */}
                      <Text color='blackAlpha.700' textStyle={'caption'}>{qrValue!.quantity}</Text>
                    </HStack>


                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Token ID:</Text>
                      {/* @ts-ignore */}
                      <Text color='blackAlpha.700' textStyle={'caption'}>{qrValue.tokenId}</Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>NFT:</Text>
                      {/* @ts-ignore */}
                      <Text color='cyan.700' textStyle={'caption'}>
                      <a href={`https://opensea.io/assets/matic/0x0632534712c3abef9922ce3bc587a2f27e25901f/${qrValue!.tokenId}`}>View DAT on opensea</a>
                      </Text>
                    </HStack>
                  </Flex>
                </Skeleton>

                <Divider/>

                <Flex direction='column' w='100%'>
                  <Skeleton isLoaded={!isGeneratingCode}>
                    <Flex justifyContent={'center'} alignItems='center' w='100%'>
                        <QRCode value={JSON.stringify(qrValue)}/>
                    </Flex>
                  </Skeleton>
                    <HStack w='100%' spacing='2' mt='2'>
                          <Text color='blackAlpha.700' textStyle={'caption'}>To redeem - cut the line and show this screen to the bouncer</Text>
                          <Text color='blackAlpha.700' fontStyle='italic' textStyle={'caption'}>It’s not a party until you arrive</Text>
                    </HStack>
                </Flex>

              </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </Flex>     
       )
}

export default QrCodeMobile