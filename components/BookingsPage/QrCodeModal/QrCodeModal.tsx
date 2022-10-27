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

    useEffect(() => {
      const options = {method: 'GET'};
    fetch(`https://api.opensea.io/api/v1/asset/0x8d036141f10FE34D739E8C289951F7bE77AB5707/${qrValue.tokenId}/?include_orders=false`, options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

    }, [qrValue])

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