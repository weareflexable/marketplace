import { Box, Button } from "@chakra-ui/react"

interface BuyNowButton{
    isMinQuantity:boolean
    buyTicketNow:()=>void
    isAuthenticated: boolean
    isBuyingTicket: boolean
}
export default function TicketButtonAction({isMinQuantity, isBuyingTicket, buyTicketNow, isAuthenticated}:BuyNowButton){
    return(
        <Box py='1' mr='6'>
            <Button size='sm' textStyle={'buttonLabel'} isLoading={isBuyingTicket} layerStyle={'primaryBtn'} disabled={isMinQuantity && isAuthenticated} onClick={buyTicketNow} variant='flexable-combo'>Buy Now!</Button>
        </Box>
    )
}
