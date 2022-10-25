import { Modal, Box, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"


interface QrCodeModalProps{
    isModalOpen: boolean,
    onCloseModal: ()=>void
}

const QrCodeModal = ({isModalOpen, onCloseModal}:QrCodeModalProps)=>{
    <Modal isOpen={isModalOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textStyle={'body'}>Scan qr code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box>
                    Qr code will be displayed here
                </Box>

            </ModalBody>
  
            <ModalFooter>
              <Button variant='ghost'>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       
}

export default QrCodeModal