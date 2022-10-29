import {useEffect} from 'react'
import { Modal, Text, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Skeleton, Flex, HStack, VStack } from "@chakra-ui/react"
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
                      <Text>314 S Franklin St Syracuse, NY 13206</Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text>Contact:</Text>
                      <Text>+1 (315) 299-4756</Text>
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

                    <HStack spacing='2' mb='1'>
                      <Text>NFT:</Text>
                      {/* @ts-ignore */}
                      <Text color='cyan'> <a href={`https://opensea.io/assets/matic/0x0632534712c3abef9922ce3bc587a2f27e25901f/${qrValue.tokenId}`}>View DAT</a> </Text>  
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text>To redeem - cut the line and show this screen to the bouncer</Text>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text fontStyle='italic' fontWeight='medium' >It’s not a party until you arrive</Text>
                    </HStack>
                  </Flex>
                </Skeleton>

                <Skeleton isLoaded={!isGeneratingCode}>
                  <Flex>
                      <QRCode value={JSON.stringify(qrValue)}/>
                  </Flex>
                </Skeleton>

              </VStack>
            </ModalBody>

          </ModalContent>
        </Modal>
        </Flex>
       )
}

export default QrCodeModal