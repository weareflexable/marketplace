import { Flex, Text, Box, Skeleton, Image, List, ListIcon, ListItem, HStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import { useAuthContext } from "../../../context/AuthContext";



interface Props{
    ticketId: string,
    quantity: number,
    type?: string
}

const data = [
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'}

]

export default function RedeemHistory({ticketId,quantity,type}:Props){

    const {paseto} = useAuthContext()


    const redeemHistoryQuery = useQuery({
        queryKey:['redeem-history', ticketId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tickets/redeem-history?ticketId=${ticketId}`,{
                headers:{
                    "Authorization": paseto
                }
            }) 
            return res.data
        },
        enabled: ticketId !== undefined,
    })

    const history = redeemHistoryQuery.data && redeemHistoryQuery.data.data;
    const totalTicketsRedeemed =  history && history.length;
    const redeemableTickets = quantity - totalTicketsRedeemed  

    


    return(
        <Flex px='1rem' mt='9' flexDirection={'column'}  width={'100%'}>

        {redeemHistoryQuery.isLoading 
            ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" mb={6} height={'10  rem'}/>
            : history && history.length === 0
            ? <EmptyList isRefreshingHistory={redeemHistoryQuery.isFetching} refresh={redeemHistoryQuery.refetch}/>
            :
            <Box style={{maxWidth: '350px', height: '350px', position: 'relative'}} >
                <List spacing={3}>
                    {history && history.map((item:any, index:number)=>(
                        <ListItem key={index}>
                            <Flex alignItems={'flex-start'} >
                                <ListIcon as={MdCheckCircle} color='accent.100' />
                                <Flex ml={3} mb={3} direction={'column'} width='100%'>
                                    <HStack mb={1} spacing={1}>
                                    <Text color={'text.200'} textStyle={'secondary'}>1</Text>  
                                    <Text color={'text.300'} textStyle={'secondary'}>Ticket Redeemed @</Text>  
                                    <Text color={'accent.200'} textStyle={'secondary'}>{history.date}</Text>  
                                    </HStack>
                                    {/* <Text textStyle={'secondary'} color={'text.200'}>{history.name}</Text> */}
                                </Flex>
                            </Flex>
                         </ListItem>
                    ))}
                
                </List>
             </Box>   
        }
    </Flex>
    )
}

interface EmptyListProps{
    refresh: ()=>void,
    isRefreshingHistory: boolean
}
function EmptyList({refresh, isRefreshingHistory}:EmptyListProps){
    return(
        <Flex justifyContent='center' mb={'3rem'} bg='#121212' alignItems='center' height='100%' width={"100%"}>
        <Flex direction='column' mt='1rem' border={'1px solid #333333'} p={'1rem'} borderRadius='4px' maxW={'350px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Awaiting Redemption
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                You are yet to start redeeming any one of your tickets
            </Text>
            <Button isLoading={isRefreshingHistory} variant='ghost' colorScheme="brand" onClick={refresh}>
               Refresh
            </Button>
        </Flex>
    </Flex>
    
    )
} 
