import React,{useState} from 'react'
import {Box,Input,HStack,Button,FormControl,Select,FormErrorMessage} from '@chakra-ui/react'
import States from 'usa-states'


export default function EventSearchBar(){



  const usa = new States.UsaStates()

  const handleSearchEvent = (event: { preventDefault: () => void; target: { value: any }[] })=>{
    event.preventDefault()
    const country = event.target[0].value;
    const state = event.target[1].value

  }

  // https://www.google.com/maps/place/Benjamin's+On+Franklin/@43.0482687,-76.1579364,17z/data=!3m2!4b1!5s0x89d9f3c753d7908f:0x7ab6f929c8299aa7!4m5!3m4!1s0x89d9f3c75179c8a7:0x9266e055f7aa2091!8m2!3d43.0482648!4d-76.1557477
  // https://www.google.com/maps/place/49%C2%B028'04.8%22N+17%C2%B006'54.5%22E/@49.4663161,17.1177782,15z/data=!4m5!3m4!1s0x0:0x8d733559bd6da184!8m2!3d49.4680001!4d17.1151401

    return(
        // <Box p='.5em'  w='100%' margin={'1em auto'} bg='blackAlpha.500' borderRadius='4px'>
            <HStack as='form' spacing={2}>
                <FormControl w='30%' maxW='250px' mr={0} isRequired>
                    <Select defaultValue={'NY'}  placeholder='Select your state'>
                      <option defaultValue={'Newyork'} value='NY'>United States</option>
                    </Select>
                    <FormErrorMessage>State is required</FormErrorMessage>
                  </FormControl>

                  <FormControl w='30%' maxW='250px' mr={0} isRequired>
                    <Select defaultValue={'Syracuse'} placeholder='Select your city'>
                        {usa.states.map(state=>(
                          <option key={state.abbreviation} value={state.name.toLowerCase()}>{state.name} - {state.abbreviation}</option>
                          ))}
                    </Select>
                    <FormErrorMessage>State is required</FormErrorMessage>
                  </FormControl>
                  <Button  type='submit'>Search for Bars</Button>   
            </HStack>
        // </Box>
    )  
}
