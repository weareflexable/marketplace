import {Grid, GridItem, Select, Image, Button, Avatar, Flex, FormErrorMessage, Box, Text, FormControl, FormLabel, Input, FormHelperText, RadioGroup, Stack, Radio, IconButton, useClipboard, Tooltip} from '@chakra-ui/react'
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
import Head from 'next/head'
import { CopyIcon } from '@chakra-ui/icons'

export default function Profile(){
    const {isAuthenticated,paseto} = useAuthContext()

    const { onCopy, value, setValue, hasCopied } = useClipboard("");

    console.log('wallet',value)
    console.log('has value',hasCopied)

  


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
        // staleTime: Infinity
    })


    // console.log(userQuery.data.data)  
       

    function copyAddress(){
      onCopy()
      setValue(userQuery?.data?.[0].walletaddress)
    }

 
    if(!isAuthenticated){ 
        return(
            <Layout>
                <UnAuthenticated/>
            </Layout>
        )
    }
 
    return(
      <>
      <Head>
       <title>Profile</title>
       <link rel="icon" href="/favicon.png" />
    </Head>
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


                        <EditableImage selectedRecord={userQuery && userQuery.data && userQuery.data[0]}/> 
                        <EditableFirstName selectedRecord={userQuery && userQuery.data && userQuery.data[0]}/> 
                        <EditableLastName selectedRecord={userQuery && userQuery.data && userQuery.data[0]}/> 
                        <EditableGender selectedRecord={userQuery && userQuery.data  && userQuery.data[0]}/> 
                        {userQuery.isLoading?<Text>Loading email</Text>:<EditableEmail isReadOnly selectedRecord={userQuery && userQuery.data && userQuery.data[0]}/>}
                        <Flex my={6} direction={'column'}>  
                        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>Wallet Address</Text>
                        <Flex style={{width:'100%',  marginTop:'.6rem', background:'#333333', padding:'1rem', borderRadius:'4px', justifyContent:'space-between', alignItems:'center'}}>
                          <Text textStyle={'secondary'} color='text.200'>{userQuery?.data?.[0].walletaddress}</Text>
                          <Tooltip  isOpen={hasCopied} label='Copied!'>
                            <IconButton onClick={copyAddress} size={'sm'} colorScheme='brand' variant={'ghost'} icon={<CopyIcon />} aria-label={'copy address button'}/>
                          </Tooltip> 
                        </Flex> 
                        </Flex> 
      
                            
                    </Flex>
                </GridItem>
            </Grid>
    </Layout>
    </>
    )
}



interface EditableProp{
    selectedRecord: User
    isReadOnly?: boolean
}

function EditableEmail({selectedRecord,isReadOnly}:EditableProp){


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
       { isReadOnly? null:  <Button variant={'link'} onClick={toggleEdit}>Edit</Button>}
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
        const payload = {
            key:'gender',
            value:value,
          }
          console.log(payload)
          mutation.mutate(payload)
     }

     function handleChange(value:any){
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
function EditableFirstName({selectedRecord}:EditableProp){


    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const formik = useFormik({
        initialValues: {
          firstName: selectedRecord && selectedRecord.firstName
        },
        onSubmit: (values,actions) => {
            // e.preventDefault() 
            const payload = {
                key:'first_name',
                value:values.firstName,
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
      mutationKey:['firstName'],
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
        <Text textStyle={'secondary'} color='text.200'>{selectedRecord && selectedRecord.firstName}</Text>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </Flex>
  )
  
    const editable = (
      <form
       style={{ marginTop:'.5rem' }}
       onSubmit={formik.handleSubmit}
       >
        <FormControl is={formik.errors.firstName}  mb={'5'}>
            {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
            <Input  
                // id='fullname'
                defaultValue={selectedRecord && selectedRecord.firstName}
                colorScheme={'brand'}
                borderColor={'#464646'} 
                color='text.300' 
                borderWidth='2px' 
                type='string'
                bg={'#121212'}
                {...formik.getFieldProps('firstName')}
            />
            {formik.touched.firstName&&formik.errors.firstName?<FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>:null}
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
        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>First Name</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
function EditableLastName({selectedRecord}:EditableProp){


    // const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const formik = useFormik({
        initialValues: {
          lastName: selectedRecord && selectedRecord.lastName
        },
        onSubmit: (values,actions) => {
            // e.preventDefault() 
            const payload = {
                key:'last_name',
                value:values.lastName,
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
      mutationKey:['lastName'],
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
        <Text textStyle={'secondary'} color='text.200'>{selectedRecord && selectedRecord.lastName}</Text>
        <Button variant={'link'} onClick={toggleEdit}>Edit</Button>
      </Flex>
  )
  
    const editable = (
      <form
       style={{ marginTop:'.5rem' }}
       onSubmit={formik.handleSubmit}
       >
        <FormControl is={formik.errors.lastName}  mb={'5'}>
            {/* <FormLabel htmlFor='email' textStyle={'secondary'} color='text.300'>Email</FormLabel> */}
            <Input  
                // id='fullname'
                defaultValue={selectedRecord && selectedRecord.lastName}
                colorScheme={'brand'}
                borderColor={'#464646'} 
                color='text.300' 
                borderWidth='2px' 
                type='string'
                bg={'#121212'}
                {...formik.getFieldProps('lastName')}
            />
            {formik.touched.lastName&&formik.errors.lastName?<FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>:null}
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
        <Text color='text.300' textStyle={'secondary'} style={{ marginRight: '2rem', marginBottom:'.3rem'}}>Last Name</Text>
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
         <Button type='submit' isLoading={isEditing || isHashingImage} variant={'link'} colorScheme={'brand'}>
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
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    country: string,
    profilePic: string | any[] | any
  }