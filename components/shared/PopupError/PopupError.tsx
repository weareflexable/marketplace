import {Drawer, Button, Text, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, DrawerFooter} from '@chakra-ui/react'

interface Props{
    onClose: ()=>void,
    isError: boolean,
    onRetryQuery: ()=>void
}
export default function PopupError({onClose, onRetryQuery, isError}: Props){
    return(
        <Drawer placement={'bottom'} onClose={onClose} isOpen={isError}>
        <DrawerOverlay />
        <DrawerContent bg={'#121212'}>
          <DrawerHeader >
            <Text as='h4' textStyle={'h4'} color='text.300'>Error in request</Text>
          </DrawerHeader>
          <DrawerBody>
            <Text textStyle={'body'} color='text.200'>You appear to be having some errors with your current request</Text>
          </DrawerBody>
          <DrawerFooter >
            <Button variant='ghost' mr={3} onClick={onRetryQuery}>
              Retry
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
}