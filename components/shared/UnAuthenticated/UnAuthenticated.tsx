import { Flex, Text, Button } from "@chakra-ui/react";

export default function UnAuthenticated(){

    const login =()=>{
        // const currentPath = `${asPath}${basePath}`
        // setStorage('lastVisitedPage',currentPath)
        location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
        // location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
    }

    return(
        <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' minHeight='100vh' width={"100%"}>
            <Flex direction='column' maxW={'350px'} alignItems='center'>
                <Text as='h3' mb='5' textStyle={'h3'}>
                    Unauthenticated!
                </Text>
                <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                    Please login before you try to access contents of this page
                </Text>
                <Button variant='ghost' onClick={login}>
                    Login to continue
                </Button>
            </Flex>
        </Flex>
    )
}