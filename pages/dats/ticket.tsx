import {Box, Text} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useDatContext } from '../../context/DatContext'

export default function Ticket(){
    const router = useRouter()
    const {currentDat:ctx_currentDat} = useDatContext()
    return(
        <Box>
            <Text>
                {JSON.stringify(ctx_currentDat)}
            </Text>
        </Box>
    )
}