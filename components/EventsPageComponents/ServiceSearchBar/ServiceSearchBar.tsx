import React from 'react'
import {Box,Input,HStack,Button,FormControl} from '@chakra-ui/react'

export default function ServiceSearchBar(){
    return(
        <Box mb='6'>
          <FormControl>
            <HStack spacing={2}>
                <Input w='40%' placeholder='Search for service'  type={'search'}/>  
                <Input w='40%' type={'date'}/>
                <Button>Search service</Button>  
            </HStack>
          </FormControl>
        </Box>
    )
}