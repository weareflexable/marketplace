import {Grid, GridItem, Select, Image, Button, Avatar, Flex, FormErrorMessage, Box, Text, FormControl, FormLabel, Input, FormHelperText, RadioGroup, Stack, Radio} from '@chakra-ui/react'
import Layout from '../components/shared/Layout/Layout'
import UnAuthenticated from '../components/shared/UnAuthenticated/UnAuthenticated'
import { useAuthContext } from '../context/AuthContext'
import {Formik, Field, Form, useFormik, FormikProps} from 'formik'
import * as Yup from 'yup';

const countryList = require('country-list')
import codes from 'country-calling-code';
import axios from 'axios'
import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPlatformPaseto } from '../utils/storage'
import { asyncStore } from '../utils/nftStorage'

export default function Profile(){
    const {isAuthenticated,paseto} = useAuthContext()

    // const paseto = getPlatformPaseto()


      async function fetchUserDetails(){
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`,{
          headers:{
            "Authorization": paseto
          }
        })
        return res.data.data
      }

     const userQuery = useQuery({
        queryKey:['user'],  
        queryFn: fetchUserDetails,
        enabled:paseto!=='' ,
        staleTime: Infinity
    })
      



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

                        <EditableImage selectedRecord={userQuery.data && userQuery.data[0]}/>
                        <EditableName selectedRecord={userQuery.data && userQuery.data[0]}/>
                        <EditableGender selectedRecord={userQuery.data && userQuery.data[0]}/>
                        <EditableEmail selectedRecord={userQuery.data && userQuery.data[0]}/>
                            {/* <form onSubmit={formik.handleSubmit}>
                                <FormControl mb={'5'}>
                                    <FormLabel textStyle={'secondary'} color='text.300'>Profile picture</FormLabel>
                                    <Avatar size='2xl' src='/avatar.png'/>
                                </FormControl> */}


                                {/* <FormControl is={formik.errors.fullname}  mb={'5'}>
                                    <FormLabel htmlFor='fullname' textStyle={'secondary'} color='text.300'>Full name</FormLabel>
                                    <Input  
                                        // id='fullname'
                                        colorScheme={'brand'}
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
                                        placeholder='Select country'
                                        {...formik.getFieldProps('country')}
                                    >
                                        {countryList.getData().map((country:any)=>(
                                            <option key={country.code} value={country.code}>{country.name}</option>
                                        ))}
                                    </Select>
                                </FormControl>

                                    <Button type='submit' colorScheme={'brand'}>
                                        Apply changes
                                    </Button>
                            </form> */}
      
                            
                    </Flex>
                </GridItem>
            </Grid>
    </Layout>
    )
}



interface EditableProp{
    selectedRecord: User
}

function EditableEmail({selectedRecord}:EditableProp){

    console.log(selectedRecord)

    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const formik = useFormik({
        initialValues: {
          email: selectedRecord && selectedRecord.email
        },
        onSubmit: (values,actions) => {
            // e.preventDefault() 
            const payload = {
                key:'email',
                value:values.email,
              }
              mutation.mutate(payload)
        },
      });

   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['email'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <Flex style={{width:'100%',  marginTop:'.6rem', background:'#333333', padding:'1rem', borderRadius:'4px', justifyContent:'space-between', alignItems:'center'}}>
        <Text textStyle={'secondary'} color='text.200'>{selectedRecord && selectedRecord.email}</Text>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </Flex>
  )
  
    const editable = (
      <form
       style={{ marginTop:'.5rem' }}
       onSubmit={formik.handleSubmit}
       >
        <FormControl is={formik.errors.email}  mb={'5'}>
            {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
            <Input  
                // id='fullname'
                defaultValue={selectedRecord && selectedRecord.email}
                colorScheme={'brand'}
                borderColor={'#464646'} 
                color='text.300' 
                borderWidth='2px' 
                type='string'
                bg={'#121212'}
                {...formik.getFieldProps('email')}
            />
            {formik.touched.email&&formik.errors.email?<FormErrorMessage>{formik.errors.email}</FormErrorMessage>:null}
        </FormControl>
        <Text as='button' onClick={toggleEdit} color={'text.300'} style={{marginRight:'.9rem'}} colorScheme={'brand'}>
            Cancel
        </Text>
        <Button type='submit' isLoading={isEditing} variant={'link'} colorScheme={'brand'}>
            Apply changes
        </Button>
      </form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>Email</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }

  type Values = {
    gender: string
  }
function EditableGender({selectedRecord}:EditableProp){


    const [value, setValue] = useState(selectedRecord && selectedRecord.gender)
    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const formik = useFormik({
        initialValues: {
          gender: selectedRecord && selectedRecord.gender
        },
        onSubmit: (values,actions) => {
            // e.preventDefault() 
            const payload = {
                key:'gender',
                value:values.gender,
              }
              console.log(payload)
            //   mutation.mutate(payload)
        },
      });

      function handleSubmit(values:any,actions:any){
        //  preventDefault() 
        console.log(values,actions)
        const payload = {
            key:'gender',
            value:value,
          }
          console.log(payload)
          mutation.mutate(payload)
     }

     function handleChange(value:any){
      console.log(value)
      setValue(value)
     }

   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['gender'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <Flex style={{width:'100%',  marginTop:'.6rem', background:'#333333', padding:'1rem', borderRadius:'4px', justifyContent:'space-between', alignItems:'center'}}>
        <Text textStyle={'secondary'} color='text.200'>{selectedRecord && selectedRecord.gender}</Text>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </Flex>
  )
  
    const editable = (
      <Formik
       style={{ marginTop:'.5rem' }}
       initialValues= {{gender: selectedRecord && selectedRecord.gender}}
       onSubmit={handleSubmit}
       >
        {
          (props:FormikProps<Values>)=>(
            <Form onSubmit={props.handleSubmit}>
              <RadioGroup
                colorScheme={'brand.300'}
                color={'text.300'}
                name='gender'
                onChange={handleChange}
                // {...formik.getFieldProps('gender')}
                defaultValue={value}
              >
                  {/* <Stack direction='row' spacing={6}> */}
                      <Radio value='Male'>Male</Radio>
                      <Radio value='Female'>Female</Radio>
                  {/* </Stack> */}
              </RadioGroup>
              <Text as='button' onClick={toggleEdit} color={'text.300'} style={{marginRight:'.9rem'}} colorScheme={'brand'}>
                  Cancel
              </Text>
              <Button type='submit' isLoading={isEditing} variant={'link'} colorScheme={'brand'}>
                  Apply changes
              </Button>
            </Form>
          )
        }
        {/* <FormControl  mb={'5'}> */}
            {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
            
        {/* </FormControl> */}
        
      </Formik>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>Gender</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
function EditableName({selectedRecord}:EditableProp){


    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const formik = useFormik({
        initialValues: {
          name: selectedRecord && selectedRecord.name
        },
        onSubmit: (values,actions) => {
            // e.preventDefault() 
            const payload = {
                key:'name',
                value:values.name,
              }
              mutation.mutate(payload)
        },
      });

   
  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['name'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
  
    const {isLoading:isEditing} = mutation ;
  
    const readOnly = (
      <Flex style={{width:'100%',  marginTop:'.6rem', background:'#333333', padding:'1rem', borderRadius:'4px', justifyContent:'space-between', alignItems:'center'}}>
        <Text textStyle={'secondary'} color='text.200'>{selectedRecord && selectedRecord.name}</Text>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </Flex>
  )
  
    const editable = (
      <form
       style={{ marginTop:'.5rem' }}
       onSubmit={formik.handleSubmit}
       >
        <FormControl is={formik.errors.name}  mb={'5'}>
            {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
            <Input  
                // id='fullname'
                defaultValue={selectedRecord && selectedRecord.name}
                colorScheme={'brand'}
                borderColor={'#464646'} 
                color='text.300' 
                borderWidth='2px' 
                type='string'
                bg={'#121212'}
                {...formik.getFieldProps('name')}
            />
            {formik.touched.name&&formik.errors.name?<FormErrorMessage>{formik.errors.name}</FormErrorMessage>:null}
        </FormControl>
        <Text as='button' onClick={toggleEdit} color={'text.300'} style={{marginRight:'.9rem'}} colorScheme={'brand'}>
            Cancel
        </Text>
        <Button type='submit' isLoading={isEditing} variant={'link'} colorScheme={'brand'}>
            Apply changes
        </Button>
      </form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>Full Name</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }

function EditableImage({selectedRecord}:EditableProp){

    const [isEditMode, setIsEditMode] = useState(false) 
    const [isHashingImage, setIsHashingImage] = useState(false)
    const [updatedCoverImageHash, setUpdatedProfilePicHash] = useState(selectedRecord && selectedRecord.profilePic)
  
  
    const {paseto} = useAuthContext()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const queryClient = useQueryClient() 
   
    const formik = useFormik({
        initialValues: {
          profilePic: selectedRecord && selectedRecord.profilePic
        },
        onSubmit: async (values,actions) => {
            const res = values.profilePic
            let profilePicHash;
  
            setIsHashingImage(true)
            try{
              profilePicHash = await asyncStore(res)
              setIsHashingImage(false)
            }catch(err){
              console.log(err)
            }

        
        
            const payload = {
              key:'profile_pic',
              value: profilePicHash,
            }
            setUpdatedProfilePicHash(profilePicHash)

            mutation.mutate(payload) 
        },
      });

  
    const mutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const mutation = useMutation({
      mutationKey:['profilePic'],
      mutationFn: mutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['user']})
      }
    })
  
  
    const {isLoading:isEditing} = mutation
  
    const extractImage = async(e: any) => {
      formik.setFieldValue('profilePic',e.target.files[0])
      // return e.target.files[0];
      if (Array.isArray(e)) {
      return e;
      }
  
    //  return e?.fileList;
  };
  
  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'150px', height:'150px', objectFit:'cover', borderRadius:'50%', border:'1px solid #333333'}} alt={`Profile pic`}  src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${selectedRecord && selectedRecord.profilePic}`}/>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
  
    const editable = (
        <form
        style={{ marginTop:'.5rem' }}
        onSubmit={formik.handleSubmit}
        >
         <FormControl  mb={'5'}>
             {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
             <Input                   
                 colorScheme={'brand'}
                 borderColor={'#464646'} 
                 color='text.300' 
                 borderWidth='2px' 
                 type='file'
                 id='profilePic'
                 name='profilePic'
                 onChange={extractImage}
                //  {...formik.getFieldProps('profilePic')}
                 bg={'#121212'}
             />
             {/* {formik.touched.profilePic&&formik.errors.profilePic?<FormErrorMessage>{formik.errors.profilePic}</FormErrorMessage>:null} */}
         </FormControl>
         <Text as='button' onClick={toggleEdit} color={'text.300'} style={{marginRight:'.9rem'}} colorScheme={'brand'}>
             Cancel
         </Text>
         <Button type='submit' isLoading={isEditing} variant={'link'} colorScheme={'brand'}>
             Apply changes
         </Button>
       </form>
    )
    return(
      <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
        <Text textStyle="secondary" color='text.300' style={{ marginRight: '2rem',}}>Profile Picture</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }


  type User = {
    name: string,
    email: string,
    gender: string,
    country: string,
    profilePic: string | any[] | any
  }