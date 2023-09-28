import {useState} from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useCheckoutContext } from '../../../context/CheckoutContext'
import { useRouter } from 'next/router'
import { getStorage, setStorage } from '../../../utils/localStorage'
import usePath from '../../../hooks/usePath'
import dayjs from 'dayjs'
import useLastVisitedPage from '../../../hooks/useLastVistedPage'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { usePaymentContext } from '../../../context/PaymentContext'
import useLocalStorage from '../../../hooks/useLocalStorage'
import useRoleName from '../../../hooks/useRoleName'

// TODO: Have a separate context for handling cart items

// This should accept a Service-item type in data
const useCommunityTicket = (data:any)=>{

    
    


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
 
 
     // checks to see if there are available tickets for selected date
     const maxPurchasableTickets =  6
 
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === maxPurchasableTickets

     const roleName = useRoleName()

     const subTotal =  ticketData.quantity * (data && data.price /100)

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
      return err
    }
    }

 
     const proceedToPayment = ()=>{
        // Timeout in order to show loading state
      
        setTimeout(() => {
            setIsProceedingToPayment(false)
            router.push('/payments')
        }, 2000);
     }

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        localStorage.setItem('lastVisitedPage',currentPath);

        // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','communities')
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      // location.href = "http://localhost:3008/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }
 

     const buyTicketNow = async()=>{

       // set filter value in local storage to be used by dats page
       localStorage.setItem('filter','communities')

        const itemPayload = {
            item:{
                id: data.id,
                type: "community"
            },
           quantity: String(ticketData.quantity),
           unitPrice: data.price,
           email: 'flexable@yahoo.com',
           users: [],
           description:data.name,
           targetDate: getStorage('selectedDate') || dayjs().format('MMM DD, YYYY') // TODO: Get current selected date
         }

         // set item payload to local storage
         // this will be used in payment page to get clientsecret incase
         // user lands on the page after authenticating (ie: client secret and paymentIntent Id were not fetched)
         setItemPayload(itemPayload)
         setSubTotal(subTotal)


        // set current page as last visited page
        localStorage.setItem('lastVisitedPage',currentPath);



        if(isAuthenticated){


            try{
              setIsProceedingToPayment(true)
              // make request to fetch client secret, paymentIntentId
              const res:any = await fetchSecret(itemPayload)
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
              console.log(err)
              setIsProceedingToPayment(false)
            }
            // if secret is available then set it to payment context
            // navigate to payment page
            // else show error toast message
            // proceedToPayment();

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

export default useCommunityTicket