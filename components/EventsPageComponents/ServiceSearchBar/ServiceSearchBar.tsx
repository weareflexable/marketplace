import React from 'react'
import {Box,Input,HStack,Button,FormControl} from '@chakra-ui/react'

export default function ServiceSearchBar(){
    return(
        <Box p='1em' margin={'0 auto'}>
          <HStack spacing={3}>
            <FormControl>
                <Input w='50px' type={'search'}/>  
                <Input w='50px' type={'date'}/>
                <Button>Search Event</Button>  
            </FormControl>
          </HStack>
        </Box>
    )
}