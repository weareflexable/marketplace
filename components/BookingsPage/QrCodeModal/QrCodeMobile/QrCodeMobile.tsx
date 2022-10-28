import {useEffect} from 'react'
import { Modal, Text, Box, DrawerCloseButton, Skeleton, Flex, HStack, VStack, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react"
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
                      <Text color='blackAlpha.700' textStyle={'caption'}>314 S Franklin St Syracuse, NY 13206</Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Contact:</Text>
                      <Text color='blackAlpha.700' textStyle={'caption'}>+1 (315) 299-4756</Text>
                    </HStack>


                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Quantity:</Text>
                      {/* @ts-ignore */}
                      <Text color='blackAlpha.700' textStyle={'caption'}>{qrValue!.quantity}</Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Contract:</Text>
                      <Text color='blackAlpha.700' textStyle={'caption'}>0x0632534712C3aBEf9922Ce3BC587A2f27E25901f</Text>
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

                    <HStack spacing='2' mb='1'>
                      <Text color='blackAlpha.500' textStyle={'caption'}>Network:</Text>
                      {/* @ts-ignore */}
                      <Text color='blackAlpha.700' textStyle={'caption'}>Polygon Mainnet</Text>
                    </HStack>
                  </Flex>
                </Skeleton>

                <Skeleton isLoaded={!isGeneratingCode}>
                  <Flex>
                      <QRCode value={JSON.stringify(qrValue)}/>
                  </Flex>
                </Skeleton>

              </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </Flex>     
       )
}

export default QrCodeMobile