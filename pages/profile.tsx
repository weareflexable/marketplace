import {Grid, GridItem, Select, Avatar, Flex, Box, Text, FormControl, FormLabel, Input, FormHelperText} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
export default function Profile(){
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
                <form action="#">
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

                    <FormControl>
                        <FormLabel textStyle={'secondary'} color='text.300'>Country</FormLabel>
                        <Select color='text.300' borderColor={'#464646'} borderWidth='2px' placeholder='Select country'>
                            <option>United Arab Emirates</option>
                            <option>Nigeria</option>
                        </Select>
                    </FormControl>
                </form>

                </Flex>
                </GridItem>
            </Grid>
    </Layout>
    )
}