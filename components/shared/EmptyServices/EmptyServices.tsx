import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function EmptyServices(){

    // const router = useRouter()
    
    return(
    <Flex justifyContent='center' bg='#121212' alignItems='center' height='100%' width={"100%"}>
        <Flex direction='column' mt='2rem' border={'1px solid #333333'} p={'1rem'} borderRadius='4px' maxW={'320px'} alignItems='center'>
            <Text as='h3' mb='5' textStyle={'h3'}>
                Oh-oh!
            </Text>
            <Text mb='3' textAlign={'center'} textStyle={'body'} color='text.200'>
                Seems like there are no services by the selected filter. May be try a different one?
            </Text>
            {/* <Button variant='ghost' onClick={navigateToMarketPlace}>
                Go back to marketplace
            </Button> */}
        </Flex>
    </Flex>
    )
}

// TODO: Refactor all empty states