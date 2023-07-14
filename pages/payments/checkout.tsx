import {useEffect, useMemo, useState} from 'react'
import { Flex, Grid, GridItem, HStack, Text, IconButton, Skeleton, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, useToast, Spinner, Box } from '@chakra-ui/react'
import Head from 'next/head'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import router from 'next/router'
import {Form, Formik, Field, FieldArray} from 'formik'
import axios from 'axios'
import { useAuthContext } from '../../context/AuthContext'
import usePath from '../../hooks/usePath'
import { usePaymentContext } from '../../context/PaymentContext'


export default function Checkout(){

    const {paseto} = useAuthContext()
    const toast = useToast()
    const {currentPath} = usePath()
    const {setPayload} = usePaymentContext()
    
    // const [quantity, setQuantity] = useState(0)
    const [userList, setUserList] = useState([{firstName: '', lastName: '', email: ''}])

    const [isProceedingToPayment, setIsProceedingToPayment] = useState(false);

    useEffect(()=>{
      const item = JSON.parse(localStorage.getItem('itemPayload') || '')
      const quantity = item && item.quantity;

      const list = createUserList(quantity)
      setUserList(list)
      console.log(list) 
      //set local state
      // setQuantity(quantity)
    },[])


    function createUserList(quantity:number){
       let users = []
       for(let i=0; i<quantity;i++){
        users.push({firstName: '', lastName:'', email: ''})
       }
       return users
    }

    // const userList = createUserList(quantity)
    // console.log(quantity)

    // console.log(userList)


    // console.log(userList)
 
    async function fetchSecret(payload:any) {
        try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/payment-intents/buy-now`,payload,{
          headers:{
            'Authorization': paseto
          }
        });
    
        return res;
  
      }catch(err){
        toast({
          title: 'Payment Error',
          description: "Unable to complete your payment. Please try again",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:'top-right'
        })
        return err
      } 
      }

  

    function validateEmail(value:string) {
        let error
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!value) {
          error = 'Email is required'
        } else if (!emailPattern.test(value.toLowerCase())) { // regex for email
          error = "Please use the correct email format eg billcage@yahoo.com 😱"
        }
        return error
      }

      const proceedToPayment = ()=>{
        // Timeout in order to show loading state
      
            setIsProceedingToPayment(false)
            router.push('/payments')
       
     }

    async function proceedToCheckout(values:any){

        const itemPayload = JSON.parse(localStorage.getItem('itemPayload')||'')
        const payload = {
            ...itemPayload,
            users:[values]
        }
        setIsProceedingToPayment(true)
        // call payment intent here
        try{
        const res:any = await fetchSecret(payload)
              if(res.status == 200){
                const stripePayload = {
                  clientSecret: res.data.clientSecret,
                  paymentIntentId: res.data.payment_intent_id,
                  totalAmount: payload.unitPrice * payload.quantity
                }

                // set stripePayload to payment context
                setPayload(stripePayload)

                         // set current page as last visited page
                localStorage.setItem('lastVisitedPage',currentPath);

                // proceed with payment
                proceedToPayment()
              }
            }
              catch(err){
                console.log(err)
                setIsProceedingToPayment(false)
              }
  
          setIsProceedingToPayment(false)
  
          console.log(payload)

            }
    


          // const userList =   [{firstName: '', lastName:'', email: ''},{firstName: '', lastName:'', email: ''}]

 
    function validateName(value:string){
        let error
        const namePattern = /^[A-Za-z ]+$/
        if (!value) {
          error = 'Field is required'
        } else if (!namePattern.test(value.toLowerCase())) { // regex for email
          error = "Please make sure name contains no numbers and special characters😱"
        }
        return error
    }

    return(
        <>
         <Head>
         <title>Events Checkout</title>
         <link rel="icon" href="/favicon.png" />
         </Head>
         <Grid px={4} minH={'100vh'} height={'100%'} templateColumns='repeat(5, 1fr)' bg='#171717'>
            <GridItem colStart={[1,1,2]} colEnd={[6,6,5]}>
                <Flex direction='column' bg='#171717' minHeight={'100vh'} height='100%' >
                    <Flex justifyContent={'flex-start'} alignItems='center' p='2' mb='5rem' height={'8vh'} borderBottom={'1px solid #242424'}>
                        <HStack ml='2' spacing={'5'}>
                            <IconButton colorScheme={'#242424'} bg='#242424' onClick={()=>router.back()} isRound icon={<ChevronLeftIcon boxSize={'5'}/>} aria-label='navigateBackToDats'/> 
                            <Text as='h1' textStyle={'h4'} color='text.300'>Checkout</Text> 
                        </HStack>
                    </Flex> 

                    <Formik
                        initialValues={{ userList: userList }}
                        onSubmit={ (values) => proceedToCheckout(values) } 
                        
                    >
                      {({values})=>(
                        <Form>
                        <FieldArray
                          name="userList"
                        >
                          {({})=>(
                               <div>
                               {values.userList && values.userList.length > 0 ? (
                                 values.userList.map((user, index) => ( 
                                   <div key={index}>
                                     <Field name={`userList.${index}.firstName`} validate={validateName}>
                                         {/* @ts-ignore */}
                                         {({ field, form }) => ( 
                                             <FormControl  isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.firstName && form.touched.firstName}>
                                             <FormLabel color={'text.300'}>First Name</FormLabel>
                                             <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='First Name' />
                                             <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                                             </FormControl> 
                                         )}
                                     </Field>
                                     <Field name='lastName' validate={validateName}>
                                         {/* @ts-ignore */}
                                         {({ field, form }) => ( 
                                             <FormControl defaultValue={user.lastName}  isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.lastName && form.touched.lastName}>
                                             <FormLabel color={'text.300'}>Last Name</FormLabel>
                                             <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='Last Name' />
                                             <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                                             </FormControl> 
                                         )}
                                     </Field>
 
                                     <Field name='email' validate={validateEmail}>
                                         {/* @ts-ignore */}
                                         {({ field, form }) => (
                                             <FormControl isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.email && form.touched.email}>
                                             <FormLabel color={'text.300'}>Email</FormLabel>
                                             <Input type='email' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='Email' />
                                             <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                         </FormControl> 
                                         )} 
                                     </Field>
                                     
                                           
                                   </div>
                                   
                                 )
                                 )
                               ) : (
                                 <Flex height={'30vh'} width={'100%'}>
                                   <Spinner/>
                                 </Flex>  
                               )}

                                    <Button
                                       mt={6}
                                       // @ts-ignore
                                       isLoading={isProceedingToPayment}
                                       w={'100%'}
                                       colorScheme='brand'
                                       size='lg'
                                       type="submit"
                                    > 
                                       Proceed Checkout
                                   </Button>
                           
                             </div>
                          )}
                        </FieldArray>
                      </Form>
                      )}
                     </Formik>

                    </Flex>
                  
            </GridItem>
            <GridItem colStart={[1,1,2]} colEnd={[6,6,5]}>
            
            </GridItem>
        </Grid>
                
        </>
    )
}




{/* 
<Formik
                        initialValues={{ email: '', firstName: '', lastName:'' }}
                        onSubmit={(values) => proceedToCheckout(values) }
                    >
                        {(props) => (
                            <Form autoComplete="new-password" style={{width:'100%'}}>
                                <Field name='firstName' validate={validateName}>

                                    {({ field, form }) => (
                                        <FormControl isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.firstName && form.touched.firstName}>
                                        <FormLabel color={'text.300'}>First Name</FormLabel>
                                        <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='First Name' />
                                        <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                                        </FormControl> 
                                    )}
                                </Field>
                                <Field name='lastName' validate={validateName}>
                                    {/* @ts-ignore */}
                                    {/* {({ field, form }) => (
                                        <FormControl isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.lastName && form.touched.lastName}>
                                        <FormLabel color={'text.300'}>Last Name</FormLabel>
                                        <Input type='string' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='Last Name' />
                                        <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                                        </FormControl> 
                                    )}
                                </Field>

                                <Field name='email' validate={validateEmail}>

                                    {({ field, form }) => (
                                        <FormControl isRequired style={{marginBottom:'.8rem'}} isInvalid={form.errors.email && form.touched.email}>
                                        <FormLabel color={'text.300'}>Email</FormLabel>
                                        <Input type='email' textStyle={'secondary'} color='text.300'  size='lg' borderColor={'#464646'}  variant={'outline'} {...field} placeholder='Email' />
                                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                    </FormControl> 
                                    )} 
                                </Field>
                                <Button
                                    mt={6}
                                    // @ts-ignore
                                    isDisabled = {props.errors.email 
                                        || props.errors.firstName 
                                        || props.errors.lastName 
                                        || props.values.email === ''
                                        || props.values.firstName === ''
                                        || props.values.lastName === ''
                                    }
                                    isLoading={isProceedingToPayment}
                                    w={'100%'}
                                    colorScheme='brand'
                                    size='lg'
                                    type="submit"
                                >
                                    Proceed Checkout
                                </Button>
                            </Form>
                        )}
                                  </Formik>*/}