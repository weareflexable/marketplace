import { Flex, Text, Box, Skeleton, Image, List, ListIcon, ListItem, HStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import { useAuthContext } from "../../../context/AuthContext";
import dayjs from "dayjs";

var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)



interface Props{
    id: string,
    quantity: number,
    type?: string
}

const data = [
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'}

]

export default function RedeemHistory({id,quantity,type}:Props){

    const {paseto} = useAuthContext()

    const urlSuffix = type === 'community' ? `communityId=${id}`: `serviceId=${id}`


    const redeemHistoryQuery = useQuery({
        queryKey:['redeem-history', id], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tickets/redeem-history?${urlSuffix}`,{
                headers:{
                    "Authorization": paseto
                }
            }) 
            return res.data
        },
        enabled: id !== undefined,
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
            <Box mb={5} style={{maxWidth: '350px', height: '100%',  position: 'relative'}} >
                <List border={'1px solid #2b2b2b'} borderRadius={3}  spacing={3}>
                    {history && history.communityTickets.map((item:any, index:number)=>(
                        <ListItem  _last={{borderBottom: 'none'}} borderBottom={'1px solid #2b2b2b'} key={index}>
                            <Flex  my={2} alignItems={'flex-start'} >
                                {/* <ListIcon as={MdCheckCircle} color='accent.100' /> */}
                                <Flex ml={2} direction={'column'} width='100%'> 
                                    <HStack mb={1} spacing={1}>
                                    <Text color={'text.300'} mr={1} textStyle={'secondary'}>1 </Text>  
                                    <Text color={'text.300'} textStyle={'secondary'}>Ticket Redeemed on </Text>  
                                    {/* @ts-ignore */}
                                    <Text color={'accent.200'} ml={2} textStyle={'secondary'}> {dayjs(item.createdAt).utc().format('MMM DD, YY · hh:mm A')}</Text>  
                                    </HStack>
                                    <Text textStyle={'secondary'} color={'text.200'}>{item.venueName}</Text> 
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
