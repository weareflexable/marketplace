import { Box, Button } from "@chakra-ui/react"

interface BuyNowButton{
    isMinQuantity:boolean
    isEventFree?: boolean,
    buyTicketNow:()=>void
    isAuthenticated: boolean
    isBuyingTicket: boolean
    quantity: number 
}
export default function TicketButtonAction({isMinQuantity, quantity, isEventFree, isBuyingTicket, buyTicketNow, isAuthenticated}:BuyNowButton){
    return(
        <Box py='1' mr='6'>
            <Button size='sm' textStyle={'buttonLabel'} isDisabled={quantity <1} isLoading={isBuyingTicket} layerStyle={'primaryBtn'} disabled={isMinQuantity} onClick={buyTicketNow} variant='flexable-combo'>{isEventFree?'Get Now!':'Buy Now!'}</Button>
        </Box>
    )
}
