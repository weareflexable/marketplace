import { Box, Button, Divider, Flex, HStack, IconButton, Text} from "@chakra-ui/react"
import { ReactNode } from "react"
import { MdRemove, MdAdd } from "react-icons/md"



interface TicketButtonProps{
    isTicketsAvailable: boolean,
    isTicketExpired: boolean,
    children: ReactNode
}

function TicketButton({ children, isTicketExpired,  isTicketsAvailable}:TicketButtonProps){
    
    return(
        <>
    { isTicketExpired
    ? <Flex width={'100%'} justifyContent={'center'} alignItems='center'>
        <Text>Sorry! Ticket has expired</Text>
    </Flex>
    : isTicketsAvailable
    ?
        <Flex maxW='400px' outline={'2px solid'} outlineColor='rgba(171, 77, 247, 0.4)' outlineOffset={2} bg='brand.300' width={'100%'} borderRadius={'60px'} direction={'column'}>
             <Flex width={'100%'}  maxW='400px' justifyContent={'space-between'} alignItems='center'>
               {children}
             </Flex>
        </Flex>
        :  <Flex width={'100%'} justifyContent={'center'} alignItems='center'>
            <Text>Sorry! Tickets are sold out</Text>
          </Flex>
    }
    </>
    )
}





export default TicketButton