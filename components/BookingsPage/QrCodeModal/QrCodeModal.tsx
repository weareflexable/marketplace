import { Modal, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import QRCode from "react-qr-code";

interface QrCodeModalProps{
    isModalOpen: boolean,
    onCloseModal: ()=>void,
    ticket: object
}

const QrCodeModal = ({ticket, isModalOpen, onCloseModal}:QrCodeModalProps)=>{

    return(
    <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Scan qr code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>
                    Qr code will be displayed here
                    <QRCode value="THis is the qr code"/>
                </Box>

            </ModalBody>
  
            <ModalFooter>
              <Button variant='ghost'>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       )
}

export default QrCodeModal