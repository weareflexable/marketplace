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

    return(
        <Box p='.5em'  margin={'1em auto'} bg='#ffffff' borderRadius='4px'>

            <HStack as='form' spacing={2}>
                <FormControl w='250px' mr={0} isRequired>
                    <Select  placeholder='Select your country'>
                      <option defaultValue={'United States'} value='US'>United States</option>
                    </Select>
                    <FormErrorMessage>Country is required</FormErrorMessage>
                  </FormControl>

                  <FormControl w='250px' mr={0} isRequired>
                    <Select placeholder='Select your state'>
                        {usa.states.map(state=>(
                          <option key={state.abbreviation} value={state.name.toLowerCase()}>{state.name} - {state.abbreviation}</option>
                          ))}
                    </Select>
                    <FormErrorMessage>State is required</FormErrorMessage>
                  </FormControl>
                  <Button type='submit'>Search for Bars</Button>   
            </HStack>
        </Box>
    )  
}
