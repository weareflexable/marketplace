import {useEffect} from 'react'
import { Modal, Text, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Skeleton, Flex, HStack, VStack } from "@chakra-ui/react"
import QRCode from "react-qr-code";
import Image from 'next/image'


interface QrCodeModalProps{
    isModalOpen: boolean,
    onCloseModal: ()=>void,
    isRedeeming: boolean,
    qrValue: object
}

const QrCodeModal = ({isRedeeming, qrValue, isModalOpen, onCloseModal}:QrCodeModalProps)=>{

    return(
    <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Scan qr code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack p='1em' spacing='2'>
                {/* <Skeleton isLoaded={isRedeeming}> */}

                  <Image width={600} objectFit='fill' height={250} src='/haloween.jpeg' alt='An image of the nft token'/>
                {/* </Skeleton> */}

                <Skeleton isLoaded={!isRedeeming}>
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
                      <Text>Opensea address:</Text>
                      <a target="_blank" rel='noreferrer' href='https://testnets.opensea.io/assets/mumbai/0x8d036141f10fe34d739e8c289951f7be77ab5707/44'>View digital access token on opensea</a>
                    </HStack>

                    <HStack spacing='2' mb='1'>
                      <Text>Quantity:</Text>
                      {/* @ts-ignore */}
                      <Text>{qrValue!.quantity}</Text>
                    </HStack>
                  </Flex>
                </Skeleton>

                <Skeleton isLoaded={!isRedeeming}>
                  <Flex>
                      <QRCode value={JSON.stringify(qrValue)}/>
                  </Flex>
                </Skeleton>

              </VStack>
            </ModalBody>

          </ModalContent>
        </Modal>
       )
}

export default QrCodeModal