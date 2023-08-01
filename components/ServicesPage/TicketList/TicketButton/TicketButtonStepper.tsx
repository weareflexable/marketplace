import { Flex, HStack, IconButton, Text } from "@chakra-ui/react"
import { MdRemove, MdAdd } from "react-icons/md"

interface TicketStepperProps{
    isMinQuantity: boolean,
    isMaxQuantity: boolean,
    decrementQuantity: ()=>void
    incrementQuantity: ()=>void,
    quantity: number
    label: string
}
// Signature stepper button which features
// increment btn, quantity incremented, decrement btn in that order
export default function TicketButtonStepper({isMinQuantity, decrementQuantity, isMaxQuantity, incrementQuantity, quantity, label}:TicketStepperProps){
    return(
            <Flex width={'50%'}  borderRadius={'50px'} p={1} justifyContent={'space-between'} alignItems='center'>
                <IconButton colorScheme={'brand.200'} textStyle={'buttonLabel'} isRound disabled={isMinQuantity} onClick={isMinQuantity?()=>{}:decrementQuantity} bg={isMinQuantity?'brand.disabled':'brand.400'} color={isMinQuantity?'text.100':'text.300'} size='sm' icon={<MdRemove/>} aria-label='remove-item'/>
                <HStack spacing="2">
                    <Text textStyle={'secondary'}  color={isMinQuantity?'text.100':'text.300'}>{quantity}</Text>
                    <Text textStyle={'secondary'} color={'text.200'}>{label}</Text>
                </HStack>
                <IconButton colorScheme={'brand.200'} textStyle={'buttonLabel'} bg='brand.400' disabled={isMaxQuantity} isRound onClick={incrementQuantity} size='sm' color='text.300' icon={<MdAdd/>} aria-label='increment-item-quantity'/>
            </Flex>
    )
}


