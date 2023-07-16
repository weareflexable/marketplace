import {useState} from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import { getStorage } from '../../../utils/localStorage'
import usePath from '../../../hooks/usePath'
import dayjs from 'dayjs'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { usePaymentContext } from '../../../context/PaymentContext'
import useLocalStorage from '../../../hooks/useLocalStorage'

// TODO: Have a separate context for handling cart items


var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)


const MAX_PURCHASABLE_TICKETS = 4

// This should accept a Service-item type in data
const useEventTicket = (data:any)=>{

    

  const toast = useToast()
  const router = useRouter()
  const {currentPath} = usePath()
  
  // Instant buy is the context that holds logic for when a user
  // clicks on the "buy now" button to expedite checkout process
  const {setPayload} = usePaymentContext()
  const {isAuthenticated, paseto} = useAuthContext()


       
       
   // Each ticket will maintain it's own state from props because
   // properties in ticket object undergo changes with the ticket component
     const [ticketData, setTicketData] = useState({
      ...data,
       quantity:0
     })

     const {setState:setItemPayload} = useLocalStorage('itemPayload',{})
     const {setState:setSubTotal} = useLocalStorage('subTotal',0)

     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === MAX_PURCHASABLE_TICKETS

     const subTotal =  ticketData.quantity * (data && data.price /100)

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

 
    

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        localStorage.setItem('lastVisitedPage',currentPath);

        // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','events')
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      // location.href = "http://localhost:3008/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }
 

     const buyTicketNow = async()=>{

       // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','events')

       console.log(data)

       if(isAuthenticated){

        const itemPayload = {
            item:{
                id: data.id,
                type: "event"
            },
           quantity: String(ticketData.quantity),
           unitPrice: data.price,
           email: 'flexable@yahoo.com',
           description:data.name,
           targetDate: dayjs(data.startTime).add(data.duration/60,'h').tz('UTC').format('MMM DD, YYYY') // TODO: Get current selected date
         }

         // set item payload to local storage
         // this will be used in payment page to get clientsecret incase
         // user lands on the page after authenticating (ie: client secret and paymentIntent Id were not fetched)
         setItemPayload(itemPayload)
         setSubTotal(subTotal)

         // redirect user to checkout page
         router.push('/payments/checkout');

        }

        loginBeforeAction();
     }
 
     const incrementQuantity =()=>{
         const updatedTicket = {...ticketData }
         updatedTicket.quantity++
         setTicketData(updatedTicket)

        }

     const decrementQuantity =()=>{
         const updatedTicket = {...ticketData }
         updatedTicket.quantity--
         setTicketData(updatedTicket)
     }

     return {
        ticketData,
        // isTicketsSoldOut, 
        isMinQuantity,
      //   ticketDate,
        isMaxQuantity,
        subTotal,
        isAuthenticated,
        isProceedingToPayment,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useEventTicket