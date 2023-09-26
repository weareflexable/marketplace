import { Flex, Text, Box, Skeleton, Image, List, ListIcon, ListItem, HStack, Button, IconButton } from "@chakra-ui/react";

import dayjs from "dayjs";

var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)



interface Props{
    quantity: number,
    type?: string,
    historyQuery: any
}


export default function RedeemHistory({historyQuery,quantity,type}:Props){


    const history = historyQuery && historyQuery.data;
    console.log('history',history)
    const totalTicketsRedeemed =  history && history.length;

 

    


    return(
        <Flex px='1rem' mt={'4rem'} mb='9'  flexDirection={'column'}  width={'100%'}>
        <Flex width={'100%'}  mb='2rem' justifyContent={'space-between'}>
            <Text   as='h3' alignSelf={'flex-start'} m={0}  textStyle={'h3'}  color='text.300'>Redemption History</Text>
          
        </Flex>
        {historyQuery.isLoading || historyQuery.isRefetching
            ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" mb={6} height={'5rem'}/>
            : history && history.length === 0
            ? <EmptyList isRefreshingHistory={historyQuery.isFetching} refresh={historyQuery.refetch}/>
            :
            <Box mb={5} style={{maxWidth: '350px', height: '100%',  position: 'relative'}} >
                <List border={'1px solid #2b2b2b'} borderRadius={3}  spacing={3}>
                    {history  && history.map((item:any, index:number)=>(
                        <ListItem  _last={{borderBottom: 'none'}} borderBottom={'1px solid #2b2b2b'} key={index}>
                            <Flex px={3}  my={2} alignItems={'flex-start'} >
                                {/* <ListIcon as={MdCheckCircle} color='accent.100' /> */}
                                <Flex ml={2} direction={'column'} width='100%'> 
                                    <HStack mb={1} spacing={1}>
                                    <Text color={'text.300'} mr={1} textStyle={'body'}>{item.redeemCount}</Text>  
                                    <Text color={'text.300'} textStyle={'body'}>out of</Text>  
                                    <Text color={'text.300'} mr={1} textStyle={'body'}>{quantity}</Text>  
                                    <Text color={'text.300'} textStyle={'body'}>DATs redeemed</Text>  
                                    {/* @ts-ignore */}
                                    {/* <Text color={'accent.200'} ml={2} textStyle={'secondary'}> {dayjs(item.createdAt).utc().format('MMM DD, YY · hh:mm A')}</Text>   */}
                                    </HStack>
                                    <Text textStyle={'secondary'} color={'text.200'}>{type=='service'?item.serviceItemName:item.venueName}</Text> 
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
        <Flex justifyContent='center' mb={'3rem'} alignItems='center' height='100%' width={"100%"}>
        <Flex direction='column' mt='1rem' border={'1px solid #333333'} p={'1rem'} borderRadius='4px' maxW={'350px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Awaiting Redemption
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                You have not redeemed your DAT yet
            </Text>
            <Button isLoading={isRefreshingHistory} variant='ghost' colorScheme="brand" onClick={refresh}>
               Refresh
            </Button>
        </Flex>
    </Flex>
    
    )
} 
