import {Grid, GridItem, Select, Button, Avatar, Flex, Box, Text, FormControl, FormLabel, Input, FormHelperText} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import UnAuthenticated from '../components/shared/UnAuthenticated/UnAuthenticated'
import { useAuthContext } from '../context/AuthContext'


export default function Profile(){
    const {isAuthenticated} = useAuthContext()

    if(!isAuthenticated){
        return(
            <Layout>
                <UnAuthenticated/>
            </Layout>
        )
    }
    return(
    <Layout>
            <Grid
                mx="1em"
                minH="inherit"
                h="100%"
                templateColumns={["1fr", "1fr", "1fr", "repeat(5, 1fr)"]}
                gap={6}
                >
                <GridItem colStart={[1, 1, 1, 2]} colEnd={[2, 2, 2, 4]}>
                <Flex width={"100%"} direction="column">
                    <Box ml={[0, 6]}>
                        <Text
                            as="h1"
                            textStyle='h3'
                            color='text.300'
                            mt="10"
                            mb="6"
                        >
                         My Profile
                        </Text>
                    </Box>
                <form style={{marginTop:'2rem'}} action="#">
                    <FormControl mb={'5'}>
                        <FormLabel textStyle={'secondary'} color='text.300'>Profile picture</FormLabel>
                        <Avatar size='2xl' src='/avatar.png'/>
                    </FormControl>

                    <FormControl mb={'5'}>
                        <FormLabel textStyle={'secondary'} color='text.300'>Full name</FormLabel>
                        <Input borderColor={'#464646'} color='text.300' borderWidth='2px' type='email' />
                    </FormControl>
                    
                    <FormControl  mb={'5'}>
                        <FormLabel textStyle={'secondary'} color='text.300'>Email address</FormLabel>
                            <Input borderColor={'#464646'} color='text.300'  borderWidth='2px' type='email' />
                        <FormHelperText textStyle={'secondary'} color='text.200'>We&apos;ll never share your email.</FormHelperText>
                    </FormControl> 

                    <FormControl mb={'9'}>
                        <FormLabel textStyle={'secondary'} color='text.300'>Country</FormLabel>
                        <Select color='text.300' borderColor={'#464646'} borderWidth='2px' placeholder='Select country'>
                            <option>United Arab Emirates</option>
                            <option>Nigeria</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <Button disabled>
                            Apply changes
                        </Button>
                    </FormControl>
                </form>

                </Flex>
                </GridItem>
            </Grid>
    </Layout>
    )
}