import {useEffect} from 'react'
import { Modal, Text, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Skeleton, Flex, HStack, VStack, Divider } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import Image from 'next/image'


interface QrCodeModalProps{
    isModalOpen: boolean,
    onCloseModal: ()=>void,
    isGeneratingCode: boolean,
    qrValue: object
}

const QrCodeModal = ({isGeneratingCode, qrValue, isModalOpen, onCloseModal}:QrCodeModalProps)=>{

    return(
      <Flex display={['none','none','none','flex']} w='100%'>

      
    <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Your Digital Access Token</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack p='1em' spacing='2'>
                {/* <Skeleton isLoaded={isGeneratingCode}> */}

                  <Image width={600} objectFit='fill' height={250} src='/haloween.jpeg' alt='An image of the nft token'/>
                {/* </Skeleton> */}

                <Skeleton isLoaded={!isGeneratingCode}>
                  <Flex direction='column'>
                    <HStack spacing='2' mb='1'>
                      <Text>Location:</Text>
                      <Text color='cyan.700' textStyle={'caption'}> 
                        <a href="https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477">314 S Franklin St Syracuse, NY 13206</a> 
                      </Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text>Call:</Text>
                      <Text color='cyan.700' textStyle={'caption'}> 
                      <a href="tel:+1-315-299-4756">+1 (315) 299-4756</a>
                      </Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text>Quantity:</Text>
                      {/* @ts-ignore */}
                      <Text>{qrValue!.quantity}</Text>
                    </HStack>


                    <HStack spacing='2' mb='1'>
                      <Text>Token ID:</Text>
                      {/* @ts-ignore */}
                      <Text>{qrValue.tokenId}</Text>
                    </HStack>

                    <HStack spacing='2' mb='3'>
                      <Text>NFT:</Text>
                      {/* @ts-ignore */}
                      <Text color='cyan.700'> <a href={`https://opensea.io/assets/matic/0x0632534712c3abef9922ce3bc587a2f27e25901f/${qrValue.tokenId}`}>View DAT</a> </Text>  
                    </HStack>

                    
                  </Flex>
                </Skeleton>

                <Divider/>

                <Flex direction='column' w='90%' justifyContent={'center'}>
                  <Skeleton isLoaded={!isGeneratingCode}>
                    <Flex justifyContent={'center'} alignItems='center' w='100%'>
                        <QRCode value={JSON.stringify(qrValue)}/>
                    </Flex>
                  </Skeleton>
                  <HStack w='100%' spacing='2' mt='2'>
                          <Text color='blackAlpha.700' textStyle={'secondary'}>To redeem - cut the line and show this screen to the bouncer</Text>
                          <Text color='blackAlpha.700' fontStyle='italic' textStyle={'secondary'}>It’s not a party until you arrive</Text>
                  </HStack>
                </Flex>

              </VStack>
            </ModalBody>

          </ModalContent>
        </Modal>
        </Flex>
       )
}

export default QrCodeModal