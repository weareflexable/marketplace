import {useState} from 'react'
import { useAuthContext } from '../../../../context/AuthContext'
import { useRouter } from 'next/router'
import { getStorage } from '../../../../utils/localStorage'
import usePath from '../../../../hooks/usePath'
import dayjs from 'dayjs'
import axios from 'axios'
import { usePaymentContext } from '../../../../context/PaymentContext'
import { useToast } from '@chakra-ui/react'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import useRoleName from '../../../../hooks/useRoleName'

// TODO: Have a separate context for handling cart items

// This should accept a Service-item type in data
const useTicket = (data:any)=>{


    const {isAuthenticated, paseto} = useAuthContext()
    const {setPayload} = usePaymentContext()
    const toast = useToast()


    const router = useRouter()
    const {currentPath} = usePath()

    const {setState:setItemPayload} = useLocalStorage('itemPayload',{})
    const {setState:setSubTotal} = useLocalStorage('subTotal',0)

       
       
   // Each ticket will maintain it's own state from props because
   // properties in ticket object undergo changes with the ticket component
     const [ticketData, setTicketData] = useState({
      ...data,
       quantity:0
     })
   //   setStorage('instantBuy',JSON.stringify(ticketData))

     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 
 
     // checks to see if there are available tickets for selected date
     const isTicketsAvailable = ticketData.ticketsAvailable > 0;
     const maxPurchasableTickets = ticketData.ticketsAvailable < 6 ? ticketData.ticketsAvailable : 6
 
     // Determines whether or not tickets are sold out
    // const isTicketsSoldOut = 
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === maxPurchasableTickets

     const subTotal =  ticketData.quantity * (ticketData.price/100)

     const roleName = useRoleName()

 
     const proceedToPayment = ()=>{
        // Timeout in order to show loading state
        setIsProceedingToPayment(true)
        setTimeout(() => {
            setIsProceedingToPayment(false)
            router.push('/payments')
        }, 2000);
     }

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        localStorage.setItem('lastVisitedPage',currentPath);

         // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','services')
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }

     async function fetchSecret(payload:any) {
          try{
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/payment-intents/buy-now`,payload,{
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
        }
    }

     const buyTicketNow = async ()=>{

       // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','services')

       const selectedDateFromStorage = getStorage('selectedDate')


        // set current page as last visited page
        localStorage.setItem('lastVisitedPage',currentPath);

        const buyNowCartItem = {
           item:{
            id: ticketData.id,
            type: 'venue'
           },
           quantity: String(ticketData.quantity),
           unitPrice: ticketData.price,
           email: 'flexable@yahoo.com',
           users: [],
           description:ticketData.name,
           //@ts-ignore
           targetDate: JSON.parse(selectedDateFromStorage) || dayjs().format('MMM DD, YYYY') // TODO: Get current selected date
         }

         setItemPayload(buyNowCartItem)
         setSubTotal(subTotal)


        if(isAuthenticated){

          try{
            setIsProceedingToPayment(true)
            // make request to fetch client secret, paymentIntentId
            const res:any = await fetchSecret(buyNowCartItem)
            if(res.status == 200){
              const stripePayload = {
                clientSecret: res.data.clientSecret,
                paymentIntentId: res.data.payment_intent_id,
                totalAmount: subTotal
              }

              // set stripePayload to payment context
              setPayload(stripePayload)

                
              // proceed with payment
              proceedToPayment()
            }
          }catch(err){
            
            setIsProceedingToPayment(false)
            console.log('Error while while fetching client secret')
          }
          return
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
        isTicketsAvailable,
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

export default useTicket