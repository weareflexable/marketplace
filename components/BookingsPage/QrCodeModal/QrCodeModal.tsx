import {useEffect} from 'react'
import { Modal, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Skeleton, Flex } from "@chakra-ui/react"
import QRCode from "react-qr-code";



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
              <Skeleton isLoaded={!isRedeeming}>
                <Flex>
                    <QRCode value={JSON.stringify(qrValue)}/>
                </Flex>
              </Skeleton>

            </ModalBody>
  
            <ModalFooter>
              <Button variant='ghost'>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       )
}

export default QrCodeModal