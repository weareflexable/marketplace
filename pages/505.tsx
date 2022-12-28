import { useRouter } from "next/router"
import {Flex, Button, Text} from '@chakra-ui/react'

export default function Custom505(){
    const router = useRouter()

    const navigateToMarketPlace =()=>{
        router.push('/')
    }
    return(
    <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' minHeight='100vh' width={"100%"}>
        <Flex direction='column' maxW={'350px'} alignItems='center'>
            <Text as='h1' mb='7' color={'text.100'} textStyle={'h1'}>
                505
            </Text>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Oh-oh! Server error
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                It seems as though there might be a problem with our servers
            </Text>
            <Button variant='ghost' onClick={navigateToMarketPlace}>
                Go back to marketplace
            </Button>
        </Flex>
    </Flex>
    )
}