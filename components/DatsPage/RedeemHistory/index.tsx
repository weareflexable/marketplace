import { Flex, Text, Box, Skeleton, Image, List, ListIcon, ListItem, HStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdCheckCircle, MdSettings } from "react-icons/md";



interface Props{
    ticketId: string
}

const data = [
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'},
    {id: '1', name:'Benjamins On Franklin', ticketRedeemCount: 1, date: 'March 23, 2025'}

]

export default function RedeemHistory({ticketId}:Props){


    const redeemHistoryQuery = useQuery({
        queryKey:['redeem-history', ticketId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/ticket/redeem-history?pageNumber=1&pageSize=12&ticketId=${ticketId}`) 
            return res.data
        },
        enabled: ticketId !== undefined,
    })

    return(
        <Flex px='1rem' mt='9' flexDirection={'column'}  width={'100%'}>
        <Text  as='h3' alignSelf={'flex-start'}  textStyle={'h3'} mb='7' color='text.300'>Redeem History</Text>
        {/* {redeemHistoryQuery.isLoading
            ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'3rem'}/>
            :  */}
            <Box style={{maxWidth: '350px', height: '350px', position: 'relative'}} >
                <List spacing={3}>
                    {data.map((item, index)=>(
                        <ListItem key={index}>
                            <Flex alignItems={'flex-start'} >
                                <ListIcon as={MdCheckCircle} color='accent.100' />
                                <Flex ml={3} mb={3} direction={'column'} width='100%'>
                                    <HStack mb={1} spacing={2}>
                                    {/* <Text color={'text.100'} textStyle={'secondary'}>1</Text>   */}
                                    <Text color={'text.300'} textStyle={'secondary'}>Ticket Redeemed @</Text>  
                                    <Text color={'accent.200'} textStyle={'secondary'}>{item.date}</Text>  
                                    </HStack>
                                    <Text textStyle={'secondary'} color={'text.200'}>{item.name}</Text>
                                </Flex>
                            </Flex>
                         </ListItem>
                    ))}
                
                </List>
             </Box>   
        {/* } */}
    </Flex>
    )
}