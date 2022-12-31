import {Grid, GridItem, Select, Button, Avatar, Flex, FormErrorMessage, Box, Text, FormControl, FormLabel, Input, FormHelperText} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import UnAuthenticated from '../components/shared/UnAuthenticated/UnAuthenticated'
import { useAuthContext } from '../context/AuthContext'
import {Formik, Field, Form, useFormik} from 'formik'
import * as Yup from 'yup';

export default function Profile(){
    const {isAuthenticated} = useAuthContext()


    const formik = useFormik({
        initialValues: {
          email: '',
          fullname: '',
          country: '',
        },
        onSubmit: (values,actions) => {
            // e.preventDefault()
            console.log(JSON.stringify(values))
            actions.resetForm()
        },
        // validationSchema: Yup.object({
        //   fullname: Yup.string().max(5,'Must be 5 characters or less').trim().required('Name is required'),
        //   email: Yup
        //     .string()
        //     .email('Must be a valid email')
        //     .required('Email is required'),
        //   country: Yup.string().trim().required('Message is required'),
        // }),
      });

      console.log(formik.touched)

    // const formik = useFormik({
    //     initialValues: {
    //       email: '',
    //     },
    //     onSubmit: (values) => {
    //       alert(JSON.stringify(values, null, 2))
    //       console.log(values)
    //     },
    //   })



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
                
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl mb={'5'}>
                                    <FormLabel textStyle={'secondary'} color='text.300'>Profile picture</FormLabel>
                                    <Avatar size='2xl' src='/avatar.png'/>
                                </FormControl>


                                <FormControl is={formik.errors.fullname}  mb={'5'}>
                                    <FormLabel htmlFor='fullname' textStyle={'secondary'} color='text.300'>Full name</FormLabel>
                                    <Input  
                                        // id='fullname'
                                        colorScheme={'brand'}
                                        placeholder='John Doe Marcus' 
                                        borderColor={'#464646'} 
                                        color='text.300' 
                                        borderWidth='2px' 
                                        type='string'
                                        bg={'#121212'}
                                        {...formik.getFieldProps('fullname')}
                                    />
                                    {formik.touched.fullname&&formik.errors.fullname?<FormErrorMessage>{formik.errors.fullname}</FormErrorMessage>:null}
                                </FormControl>
                        

                                <FormControl  mb={'5'}>
                                    <FormLabel textStyle={'secondary'} color='text.300'>Email address</FormLabel>
                                    <Input 
                                        borderColor={'#464646'} 
                                        type='email'
                                        color='text.300'  
                                        borderWidth='2px' 
                                        {...formik.getFieldProps('email')}
                                    />
                                    <FormHelperText textStyle={'secondary'} color='text.200'>We&apos;ll never share your email.</FormHelperText>
                                </FormControl> 

                                <FormControl mb={'9'}>
                                    <FormLabel htmlFor='country' textStyle={'secondary'} color='text.300'>Country</FormLabel>
                                    <Select 
                                        color='text.300' 
                                        borderColor={'#464646'} 
                                        borderWidth='2px' 
                                        {...formik.getFieldProps('country')}
                                        placeholder='Select country'
                                    >
                                        <option>United Arab Emirates</option>
                                        <option>Nigeria</option>
                                    </Select>
                                </FormControl>

                                    <Button type='submit' colorScheme={'brand'}>
                                        Apply changes
                                    </Button>
                            </form>
      
                            
                    </Flex>
                </GridItem>
            </Grid>
    </Layout>
    )
}