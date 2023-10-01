import React,{useEffect,useState} from 'react'
import {Box,Flex,Text, SkeletonText, Heading,useDisclosure,Image,SimpleGrid,Skeleton, DarkMode, IconButton, Center, VStack, useMediaQuery, Button} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Header from '../../components/shared/Header/Header'
import Cart from '../../components/ServicesPage/Cart/Cart'
import TicketList from '../../components/ServicesPage/TicketList'
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
import ServiceSkeleton from '../../components/ServicesPage/TicketList/Skeleton/Skeleton'

var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)

//@ts-ignore
import CalendarDates from "calendar-dates";
import TicketListItem from '../../components/ServicesPage/TicketList/TicketListItem'
const calendarDates = new CalendarDates()


export default function ServicesPage(){
    

// Get calendar dates of current and next month
    useEffect(() => {
        async function getCalendarDates(){
            setIsLoadingDates(true)
            try{
                var now = new Date();
                const current = new Date(now.getFullYear(), now.getMonth()+1, 1);

                const dates = await calendarDates.getDates(now)
                const filteredDates = dates.filter((date:any)=>date.type === 'current')
                const nextMonth = await calendarDates.getDates(current)
                const filteredNextMonth = nextMonth.filter((date:any)=>date.type === 'current'|| date.type ==='next')
                const combinedDates = filteredDates.concat(filteredNextMonth)

                setIsLoadingDates(false)
                setDates(combinedDates)
            }catch(err){
                console.log('error getting dates',err)
                setIsLoadingDates(false)
            }
        }
        getCalendarDates()
    }, [])

    

    // TODO: consider moving these to a reducer, maybe?
    const [dates, setDates] = useState([])
    const [isLoadingDates, setIsLoadingDates] = useState(false)

    const router = useRouter();
    const {setAmount,setCart:setCartItems} =  useCheckoutContext()
    // const {state:cart, setState:setCart} = useLocalStorage('cart',[]);
    const {state:selectedDate, setState:setSelectedDate} = useLocalStorage('selectedDate', dayjs().format('MMM DD, YYYY'))


    // TODO: mark state to show that it interacts with local storage

    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
    const [isProcessDrawerOpen, setIsProcessDrawerOpen] = useState(false)

    const [isLargerThan62] = useMediaQuery('(min-width: 62em)')

    // Format date to format understood by API
    // const formatedDate = moment(serviceDate))
    // Extract service ID from query params to be used for data fetching
    // const pageQueryParam = query.serviceId
    // const pageQueryParam = asPath+basePath
    // console.log(asPath,basePath)
    const serviceId = router.query.serviceId;


    
    const serviceQuery = useQuery({
        queryKey:['single-service',serviceId], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/services?status=1&pageNumber=1&pageSize=12&id=${serviceId}`) 
            return res.data
        },
        enabled: serviceId !== undefined,
        staleTime: Infinity
    })
    
    // Confirming object is not undefined before accessing fields
    const service = serviceQuery && serviceQuery.data && serviceQuery.data.data[0]

    // console.log('services',service)   
    
    // const availabilityQuery = useQuery({
    //     queryKey:['availability',serviceId], 
    //     queryFn:async()=>{
    //         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service/availability?key=org_service_id&value=${serviceId}&pageNumber=0&pageSize=12&key2=availability`) 

    //         return res.data.data
    //     },
    //     enabled: serviceId !== undefined,
    //     staleTime: 30000 
    // })

    // const availabilities = availabilityQuery.data && availabilityQuery.data


    // The service-item query is dependent on the success of both the service and the availability queries
    // before it can finally be executed.
    const shouldFetchServiceItems = serviceId !== undefined;

    const serviceItemsQuery = useQuery({
        queryKey:['serviceItems',serviceId,selectedDate], 
        queryFn:async()=>{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/service-items-using-date?orgServiceId=${serviceId}&pageNumber=1&pageSize=50&date=${selectedDate}`) 
            return res.data.data
        },
        enabled: shouldFetchServiceItems,
        staleTime: 3000,
        cacheTime:0
    })



    const { isOpen, onOpen:showPaymentModal, onClose } = useDisclosure() 

    // // effect to check if mobile cart was open before user got redirect to login page
    // useEffect(()=>{
    //     const isCartOpenBeforeLogin = getStorage('isCartOpenBeforeLogin');
    //     if(isCartOpenBeforeLogin === 'true'){
    //         // Open cart drawer back up
    //         setIsCartDrawerOpen(true)
    //         // Then immediately clear storage
    //         deleteStorage('isCartOpenBeforeLogin')
    //     } 
    // },[])


 

    // TODO: rename to cartItemExist
    // const checkCartItemExist = (id:string)=>{
    //     const clonedCart = cart.slice()
    //     return clonedCart.filter((cartItem:any)=>cartItem.id === id).length>0 ? true: false;
    // } 


    // const addToCartHandler = (id:string)=>{

    //     // dont duplicate items in cart
    //     // TODO: find better name for this
    //     const isDuplicateCartItem = checkCartItemExist(id)
    //     if(isDuplicateCartItem) return
  
    //     let clonedServices = serviceQuery && serviceQuery.data.serviceItems.slice() 
    //     let targetTicket = clonedServices.find((service:any)=>service.id===id);

    //     // add quantity field to service
    //     const serviceWithQuantity = {
    //         ...targetTicket,
    //         venue: serviceQuery.data.name ,
    //         quantity:1
    //     }

    //     const clonedCart = cart.slice();
    //     clonedCart.push(serviceWithQuantity);
    //     console.log(clonedCart)
    //     setCart(clonedCart);
    //     setCartItems(clonedCart)
    //     // always clear instant purchase whenever user adds to cart
    //     deleteStorage('instantBuy')

    // }

    // const removeCartItemHandler = (id:string)=>{
    //     const clonedCart = cart.slice();
    //     const targetIndex = clonedCart.findIndex((cartItem:any)=>cartItem.id === id)
    //     clonedCart[targetIndex].quantity = 0;
    //     const updatedBookings = clonedCart.filter((cartItem:any)=>cartItem.id !== id);
    //     setCart(updatedBookings);
    // }

    // const incrementCartItemQuantity = (id: string)=>{
    //     const clonedCart = cart.slice();
    //     const targetItem = clonedCart.find((cartItem:any)=>cartItem.id === id);
    //     targetItem!.quantity++
    //     setCart(clonedCart);
    // }
    // const decrementCartItemQuantity = (id: string)=>{
    //     const clonedCart = cart.slice();
    //     const targetItem = clonedCart.find((cartItem:any)=>cartItem.id === id);
    //     targetItem!.quantity--
    //     setCart(clonedCart);
    // }


    const createOrder = (totalCost:number)=>{
       setAmount(totalCost); // remove this
       isLargerThan62? showPaymentModal(): setIsProcessDrawerOpen(true)
    }


    // const loginBeforePayment = (totalCost:number)=>{
    //     // this is to tell browser that payment was initiated before login
    //         setAmount(totalCost)
    //         setCartItems(cart)
    //         // set current path
    //         const currentPath = `${asPath}${basePath!==''? basePath:'/'}`
    //         setStorage('lastVisitedPage',currentPath)

    //         // store that login was clicked from here
    //         setStorage('isCartOpenBeforeLogin', 'true')

    //         push('/landing')
        
    // }

    function changeDate(date:any){ 
        const readableFormat = dayjs(date.iso).format('MMM DD, YYYY')

        // set selected date value in storage
        setSelectedDate(readableFormat);
    }

     

    
    const activeServiceItems = serviceItemsQuery.data && serviceItemsQuery.data.filter((serviceItem: any)=>serviceItem.status == 1)
   

        return( 

    <> 
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/> */}
         <title>{service && service.name}</title>
         <link rel="icon" href="/favicon.png" />
      </Head>
        <Box position={'relative'}  h='100%' minH={'100vh'} layerStyle={'base'}> 
            {serviceQuery.isLoading
                ?<Skeleton mx='1rem' startColor='#2b2b2b' endColor="#464646" height={'2rem'}/>
                :<Header/>
            }  
            <SimpleGrid mt='2' h={'100%'} columns={8} spacing='2'>
                <Flex h='100%'  gridColumnStart={[1,1,1,2]} gridColumnEnd={[9,9,9,8]} direction='column'  flex='2'>
                    
                       { serviceQuery.isLoading || service === undefined || serviceQuery.isError
                       ?<Skeleton mx='1rem' mb='1rem' startColor='#2b2b2b' endColor="#464646" height={'40vh'}/> 
                       :<StoreHeader 
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
                    :<Box w={['93%','100%']} borderRadius={4} margin={'0 auto'}  p={4} whiteSpace={'nowrap'} bg='#242424' overflowY={'hidden'} overflow='hidden' overflowX={'scroll'}>
                        {dates.map((date:any)=>(
                            <React.Fragment key={date.iso}>
                            {dayjs().isBefore(dayjs(date.iso)) || dayjs().isSame(dayjs(date.iso),'date')
                            ?<Flex background='#242424' position={dayjs().isSame(dayjs(date.iso),'date')?'sticky':'relative'}  onClick={date.type === 'previous'?()=>{}:()=>changeDate(date)} w={'70px'}  direction={'column'} alignItems='center'  p={2} cursor={'pointer'} display={'inline-block'}  ml={4} key={date.iso}>
                                <Text textAlign={'center'} color={'text.300'}>{dayjs(date.iso).format('MMM')}</Text>
                                <Text textAlign={'center'} color={dayjs(selectedDate).format('MMM DD, YYYY') ===  dayjs(date.iso).format('MMM DD, YYYY')?'accent.300':'text.200'} textStyle={'h3'}>{date.date}</Text>
                                <Text textAlign={'center'} color={'text.300'}>{dayjs(date.iso).format('ddd')}</Text>
                            </Flex>:null}
                            </React.Fragment> 
                        ))}
                    </Box>}


                        
                    {
                    serviceItemsQuery.isLoading || serviceItemsQuery.isRefetching
                    ?<ServiceSkeleton/>
                    :<TicketList>
                         {activeServiceItems && activeServiceItems.map((service: any)=>(
                            <TicketListItem 
                                key={service.id}
                                selectedDate={selectedDate} 
                                data={service}
                            />
                        ))}
                        </TicketList>
                    }
                        

                </Flex> 


            </SimpleGrid>
          

          
        </Box> 
        </>
    // </DarkMode>
    )
}



