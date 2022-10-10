import React, { ReactNode } from 'react'
import {
    Box,
    Heading,
    Flex,
    Checkbox
} from '@chakra-ui/react'


interface ServiceFilterProps{
    onGetFilter: (value:string)=>void,
    filters: Array<string>
}
export default function ServiceFilter({onGetFilter,filters}:ServiceFilterProps){
    return(
        <Flex direction='column' p='2' borderEndRadius='4' w='100%' >
            <Heading mb='3' as='h4'  size='sm'>Service Filter</Heading>
            <Filter value='lineSkip' name='Line Skip'>
                <Checkbox isChecked={filters.includes('lineSkip')} onChange={(event)=>onGetFilter(event.target.value)} value='lineSkip'/>
            </Filter>
            <Filter value='bottleService' name='Bottle Service'>
                <Checkbox isChecked={filters.includes('bottleService')} onChange={(event)=>onGetFilter(event.target.value)} value='bottleService'/>
            </Filter>
        </Flex>
    )
}

interface FilterProps{
    name: string,
    value: string,
    children: ReactNode
}
const Filter: React.FC<FilterProps> =({name, children})=>{
    return(
        <Flex w='100%' alignItems='center' justifyContent='space-between'>
            <Box>
                {name}
            </Box>
            {children}
        </Flex>
    )
}