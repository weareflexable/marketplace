import React from 'react'
import {Box,Input,HStack,Button,FormControl} from '@chakra-ui/react'


export default function EventSearchBar(){
    return(
        <Box p='.5em' margin={'1em auto'} bg='#ffffff' borderRadius='4px'>
          <FormControl>
            <HStack spacing={3}>
                <Input w='150px' type={'date'}/>  
                <Input w='250px' placeholder='Search by location' type={'location'}/>  
                <Button>Search Event</Button>  
            </HStack>
          </FormControl>
        </Box>
    )
}