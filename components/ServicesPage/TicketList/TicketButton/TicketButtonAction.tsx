import { Box, Button } from "@chakra-ui/react"

interface BuyNowButton{
    isMinQuantity:boolean
    isEventFree: boolean,
    buyTicketNow:()=>void
    isAuthenticated: boolean
    isBuyingTicket: boolean
}
export default function TicketButtonAction({isMinQuantity, isEventFree, isBuyingTicket, buyTicketNow, isAuthenticated}:BuyNowButton){
    return(
        <Box py='1' mr='6'>
            <Button size='sm' textStyle={'buttonLabel'} isLoading={isBuyingTicket} layerStyle={'primaryBtn'} disabled={isMinQuantity} onClick={buyTicketNow} variant='flexable-combo'>{isEventFree?'Get Now!':'Buy Now!'}</Button>
        </Box>
    )
}
