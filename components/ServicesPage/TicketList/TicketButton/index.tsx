import { Box, Button, Divider, Flex, HStack, IconButton, Text} from "@chakra-ui/react"
import { ReactNode } from "react"
import { MdRemove, MdAdd } from "react-icons/md"



interface TicketButtonProps{
    isTicketsAvailable: boolean,
    children: ReactNode
}

function TicketButton({ children,  isTicketsAvailable}:TicketButtonProps){
    
    return(
        <>
    { isTicketsAvailable
        ?
        <Flex maxW='400px' outline={'2px solid'} outlineColor='rgba(171, 77, 247, 0.4)' outlineOffset={2} bg='brand.300' width={'100%'} borderRadius={'60px'} direction={'column'}>
             <Flex width={'100%'}  maxW='400px' justifyContent={'space-between'} alignItems='center'>
               {children}
             </Flex>
        </Flex>
        : <Flex width={'100%'} justifyContent={'center'} alignItems='center'>
            <Text>Sorry! Tickets are sold out</Text>
          </Flex>
    }
    </>
    )
}



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
export function TicketStepper({isMinQuantity, decrementQuantity, isMaxQuantity, incrementQuantity, quantity, label}:TicketStepperProps){
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


interface BuyNowButton{
    isMinQuantity:boolean
    buyTicketNow:()=>void
    isAuthenticated: boolean
    isBuyingTicket: boolean
}
export function BuyNowButton({isMinQuantity, isBuyingTicket, buyTicketNow, isAuthenticated}:BuyNowButton){
    console.log(isBuyingTicket)
    return(
        <Box py='1' mr='6'>
            <Button size='sm' textStyle={'buttonLabel'} isLoading={isBuyingTicket} layerStyle={'primaryBtn'} disabled={isMinQuantity && isAuthenticated} onClick={buyTicketNow} variant='flexable-combo'>Buy Now!</Button>
        </Box>
    )
}




export default TicketButton