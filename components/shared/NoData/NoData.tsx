import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function NoData(){

    const router = useRouter()

    const navigateToMarketPlace =()=>{
        router.push('/')
    }
    return(
    <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' minHeight='60vh' width={"100%"}>
        <Flex direction='column' maxW={'320px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                No DATS!
            </Text>
            <Text mb='5' textAlign={'center'} textStyle={'body'} color='text.200'>
               {` Seems like you haven't booked any DAT yet`}
            </Text>
            <Button variant='ghost' onClick={navigateToMarketPlace}>
                Go back to marketplace
            </Button>
        </Flex>
    </Flex>
    )
}

// TODO: Refactor all empty states