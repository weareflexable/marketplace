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

// TODO: Have a separate context for handling cart items

// This should accept a Service-item type in data
const useCommunityTicket = (data:any)=>{

    
    


    const {isAuthenticated, paseto} = useAuthContext()
    const toast = useToast()

    // Instant buy is the context that holds logic for when a user
    // clicks on the "buy now" button to expedite checkout process
    const {setPayload} = usePaymentContext()

    const router = useRouter()
    const {currentPath} = usePath()

       
       
   // Each ticket will maintain it's own state from props because
   // properties in ticket object undergo changes with the ticket component
     const [ticketData, setTicketData] = useState({
      ...data,
       quantity:0
     })


     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 
 
     // checks to see if there are available tickets for selected date
     const maxPurchasableTickets =  6
 
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === maxPurchasableTickets

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
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }


     const buyTicketNow = async()=>{

        // console.log(ticketData)

        const itemPayload = {
            item:{
                id: data.id,
                type: "community"
            },
           quantity: String(ticketData.quantity),
           unitPrice: data.price,
           email: 'flexable@yahoo.com',
           description:data.name,
           targetDate: getStorage('selectedDate') || dayjs().format('MMM DD, YYYY') // TODO: Get current selected date
         }


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

                // set current page as last visited page
                localStorage.setItem('lastVisitedPage',currentPath);

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