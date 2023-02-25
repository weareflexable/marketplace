import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, SkeletonText, Heading,useDisclosure,Image,SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery, Button} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/ServiceList'
import CartSummary from '../../components/ServicesPage/CartSummary/CartSummary'
import {useQuery} from '@tanstack/react-query'
import { useCheckoutContext } from '../../context/CheckoutContext'
import StoreHeader from '../../components/ServicesPage/StoreHeader/StoreHeader'
import { deleteStorage, getStorage, setStorage } from '../../utils/localStorage'
import { MdAddShoppingCart } from 'react-icons/md'
import MobileCart from '../../components/ServicesPage/Cart/MobileCart/MobileCart'
import MobileCartSummary from '../../components/ServicesPage/CartSummary/MobileCartSummary/MobileCartSummary'
import useLocalStorage from '../../hooks/useLocalStorage'
import Head from 'next/head'
import axios from 'axios'
import dayjs from 'dayjs'
import ServiceSkeleton from '../../components/ServicesPage/ServiceList/Skeleton/Skeleton'

var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

//@ts-ignore
import CalendarDates from "calendar-dates";
import { Service } from '../../data/services'
const calendarDates = new CalendarDates()


export default function ServicesPage(){
    


    useEffect(() => {
        async function getCalendarDates(){
            setIsLoadingDates(true)
            try{
                const dates = await calendarDates.getDates(new Date())
                setIsLoadingDates(false)
                setDates(dates)
            }catch{
                setIsLoadingDates(false)
            }
        }
        getCalendarDates()
    }, [])

    

    // TODO: consider moving these to a reducer, maybe?
    const [dates, setDates] = useState([])
    const [isLoadingDates, setIsLoadingDates] = useState(false)

    const {query,push,asPath,basePath} = useRouter();
    const {setAmount,setCart:setCartItems} =  useCheckoutContext()
    const {state:cart, setState:setCart} = useLocalStorage('cart',[]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format())

    console.log(dates)

    // const [isLoading, setIsLoading] = useState(false)
    // const [data, setData] = useState<any>({})

    // TODO: mark state to show that it interacts with local storage

    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
    const [isProcessDrawerOpen, setIsProcessDrawerOpen] = useState(false)

    const [isLargerThan62] = useMediaQuery('(min-width: 62em)')

    // Format date to format understood by API
    // const formatedDate = moment(serviceDate))
    // Extract service ID from query params to be used for data fetching
    // const pageQueryParam = query.serviceId
    const pageQueryParam = asPath+basePath
    // console.log(asPath,basePath)
    const serviceId = query.serviceId;


    
    const serviceQuery = useQuery({
        queryKey:['single-service',serviceId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?key=status&value=1&pageNumber=0&pageSize=12&key2=id&value2=${serviceId}`) 

            return res.data
        },
        enabled: serviceId !== undefined,
        staleTime: 30000
    })
    console.log(serviceQuery)
    
    // Confirming object is not undefined before accessing fields
    const service = serviceQuery.data && serviceQuery.data.data[0]
    
    const availabilityQuery = useQuery({
        queryKey:['availability',serviceId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service/availability?key=org_service_id&value=${serviceId}&pageNumber=0&pageSize=12&key2=availability`) 

            return res.data.data
        },
        enabled: serviceId !== undefined,
        staleTime: 30000 
    })

    const availabilities = availabilityQuery.data && availabilityQuery.data
    console.log(availabilities)  


    // The service-item query is dependent on the success of both the service and the availability queries
    // before it can finally be executed.
    const shouldFetchServiceItems = serviceId !== undefined && availabilityQuery.isSuccess;

    const serviceItemsQuery = useQuery({
        queryKey:['serviceItems',serviceId,selectedDate], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service-items-using-date?key=org_service_id&value=${serviceId}&pageNumber=0&pageSize=12&key2=date&value2=${selectedDate}`) 
            return res.data.data
        },
        enabled: shouldFetchServiceItems,
        staleTime: 30000 
    })



    const { isOpen, onOpen:showPaymentModal, onClose } = useDisclosure() 

    // effect to check if mobile cart was open before user got redirect to login page
    useEffect(()=>{
        const isCartOpenBeforeLogin = getStorage('isCartOpenBeforeLogin');
        if(isCartOpenBeforeLogin === 'true'){
            // Open cart drawer back up
            setIsCartDrawerOpen(true)
            // Then immediately clear storage
            deleteStorage('isCartOpenBeforeLogin')
        } 
    },[])


 

    // TODO: rename to cartItemExist
    const checkCartItemExist = (id:string)=>{
        const clonedCart = cart.slice()
        return clonedCart.filter((cartItem:any)=>cartItem.id === id).length>0 ? true: false;
    } 


    const addToCartHandler = (id:string)=>{

        // dont duplicate items in cart
        // TODO: find better name for this
        const isDuplicateCartItem = checkCartItemExist(id)
        if(isDuplicateCartItem) return
  
        let clonedServices = serviceQuery && serviceQuery.data.serviceItems.slice() 
        let targetTicket = clonedServices.find((service:any)=>service.id===id);

        // add quantity field to service
        const serviceWithQuantity = {
            ...targetTicket,
            venue: serviceQuery.data.name ,
            quantity:1
        }

        const clonedCart = cart.slice();
        clonedCart.push(serviceWithQuantity);
        console.log(clonedCart)
        setCart(clonedCart);
        setCartItems(clonedCart)
        // always clear instant purchase whenever user adds to cart
        deleteStorage('instantBuy')

    }

    const removeCartItemHandler = (id:string)=>{
        const clonedCart = cart.slice();
        const targetIndex = clonedCart.findIndex((cartItem:any)=>cartItem.id === id)
        clonedCart[targetIndex].quantity = 0;
        const updatedBookings = clonedCart.filter((cartItem:any)=>cartItem.id !== id);
        setCart(updatedBookings);
    }

    const incrementCartItemQuantity = (id: string)=>{
        const clonedCart = cart.slice();
        const targetItem = clonedCart.find((cartItem:any)=>cartItem.id === id);
        targetItem!.quantity++
        setCart(clonedCart);
    }
    const decrementCartItemQuantity = (id: string)=>{
        const clonedCart = cart.slice();
        const targetItem = clonedCart.find((cartItem:any)=>cartItem.id === id);
        targetItem!.quantity--
        setCart(clonedCart);
    }


    const createOrder = (totalCost:number)=>{
       setAmount(totalCost); // remove this
       isLargerThan62? showPaymentModal(): setIsProcessDrawerOpen(true)
    }


    const loginBeforePayment = (totalCost:number)=>{
        // this is to tell browser that payment was initiated before login
            setAmount(totalCost)
            setCartItems(cart)
            // set current path
            const currentPath = `${asPath}${basePath!==''? basePath:'/'}`
            setStorage('lastVisitedPage',currentPath)

            // store that login was clicked from here
            setStorage('isCartOpenBeforeLogin', 'true')

            push('/landing')
        
    }

    function changeDate(date:any){ 
        //@ts-ignore
        const utcFormat = dayjs.utc(date.iso, 'MMM DD, YYYY').format()
        const readableFormat = dayjs(date.iso).format('MMM DD, YYYY')

        console.log(utcFormat)

        setStorage('selectedDate', readableFormat)
        setSelectedDate(utcFormat);
    }

     


    console.log(service)
    
    const activeServiceItems = serviceItemsQuery.data && serviceItemsQuery.data.filter((serviceItem: any)=>serviceItem.status == 1)
   
        

        return( 

    <> 
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
      </Head>
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            {serviceQuery.isLoading
                ?<Skeleton mx='1rem' startColor='#2b2b2b' endColor="#464646" height={'1rem'}/>
                :<Header/>
            }  
            <SimpleGrid mt='2' h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    
                       { serviceQuery.isLoading
                       ?<Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'4.5rem'}/> 
                       :<StoreHeader 
                         coverImageHash={service.logoImageHash || ''}
                         storeName={service.name}
                         lat = {service.latitude} 
                         lon = {service.longitude}
                         city = {service.city}
                         state = {service.state}
                         street = {service.street}
                         logoImageHash = {service.logoImageHash}
                         />
                        }

                    {isLoadingDates
                    ? <Skeleton mx='1rem' mt='1rem' startColor='#2b2b2b' endColor="#464646" height={'1.5rem'}/>
                    :<Box w='93%' margin={'0 auto'}  p={4} whiteSpace={'nowrap'} bg='#242424' overflowY={'hidden'} overflow='hidden' overflowX={'scroll'}>
                        {dates.map((date:any)=>(
                            <>
                            {dayjs().isBefore(dayjs(date.iso)) || dayjs().isSame(dayjs(date.iso),'date')
                            ?<Flex background='#242424' position={dayjs().isSame(dayjs(date.iso),'date')?'sticky':'relative'}  onClick={date.type === 'previous'?()=>{}:()=>changeDate(date)} w={'70px'}  direction={'column'} alignItems='center'  p={2} cursor={'pointer'} display={'inline-block'}  ml={4} key={date.iso}>
                                <Text textAlign={'center'} color={'text.300'}>{dayjs(date.iso).format('MMM')}</Text>
                                <Text textAlign={'center'} color={dayjs(selectedDate).format('MMM DD, YYYY') ===  dayjs(date.iso).format('MMM DD, YYYY')?'accent.300':'text.200'} textStyle={'h3'}>{date.date}</Text>
                                <Text textAlign={'center'} color={'text.300'}>{dayjs(date.iso).format('ddd')}</Text>
                            </Flex>:null}
                            </> 
                        ))}
                    </Box>}


                        
                    {
                    serviceItemsQuery.isLoading || serviceItemsQuery.isRefetching
                    ?<ServiceSkeleton/>
                    :<TicketList 
                        date={selectedDate}
                        onAddToCart={addToCartHandler} 
                        services={activeServiceItems}
                    />
                    }
                        

                </Flex> 

                    {/* Dont render web cart on mobile */}
                <Flex display={['none','none','none','flex']} gridColumnStart={6} gridColumnEnd={8} h='100%'>
                    {cart.length>0?
                        <Cart 
                            onCreateOrder={createOrder} 
                            onIncrementCartItemQuantity={incrementCartItemQuantity} 
                            onDecrementCartItemQuantity={decrementCartItemQuantity} 
                            onRemoveCartItem={removeCartItemHandler} 
                            loginBeforePayment = {loginBeforePayment}
                            tickets={cart}
                        />
                    :null}
                </Flex>

                {/* Dont render mobile cart on large screen */}
                {isCartDrawerOpen?<Flex display={['flex','flex','flex','none']} width={'100%'}>
                    <MobileCart
                        onCreateOrder={createOrder} 
                        onIncrementCartItemQuantity={incrementCartItemQuantity} 
                        onDecrementCartItemQuantity={decrementCartItemQuantity} 
                        onRemoveCartItem={removeCartItemHandler} 
                        loginBeforePayment = {loginBeforePayment}
                        tickets={cart}
                        isDrawerOpen={isCartDrawerOpen}
                        onCloseDrawer={()=>setIsCartDrawerOpen(false)}
                    />
                </Flex>:null}

            </SimpleGrid>
            {/* cart button to only display on mobile */}
            {cart.length>0?
                <Box
                display={['block','block','block','none']}
                width='50px'
                height='55px' 
                position='absolute'
                bottom ='8%'
                right='10%'
                >
                    <Center zIndex={2} position='absolute' borderRadius={'50%'} w='20px' h='20px' bg='tomato' color='white'>
                        <Text fontSize='12px' fontWeight='bold'>{cart.length}</Text>
                    </Center>

                     <IconButton 
                        isRound
                        onClick={()=>setIsCartDrawerOpen(true)}
                        colorScheme='teal'
                        aria-label='Open cart'
                        size='lg'
                        icon={<MdAddShoppingCart color='cyan.300'/>}
                      />
                </Box>
            :null}

           { isOpen? <CartSummary 
              onCloseModal={onClose} 
              isModalOpen={isOpen} 
              cart={cart}
              totalCost = {50}
              />:null}

              {isProcessDrawerOpen?<MobileCartSummary
                onCloseDrawer={()=>setIsProcessDrawerOpen(false)} 
                isDrawerOpen={isProcessDrawerOpen} 
                cart={cart}
                totalCost = {50}
              />:null}
        </Box> 
        </>
    // </DarkMode>
    )
}

const ServicePageSkeleton = ()=>{
    return(
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            <Skeleton height={'1.2rem'}/>
            <SimpleGrid mt='2' h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,6]} direction='column'  flex='2'>
                    <Skeleton w='100%' height={'350px'}/>

                    <Skeleton my='1' height={'1rem'}/>

                    <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='2' />
                    <SkeletonText mt='3' noOfLines={4} spacing='4' skeletonHeight='2' />

                </Flex> 
            </SimpleGrid>       
        </Box> 
    )
}