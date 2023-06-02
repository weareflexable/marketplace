import {PKPass} from 'passkit-generator'

import getCertificates from './getCertificates'
import path from 'path'
import { NextApiResponse } from 'next'
import dayjs from 'dayjs'

export default async function handler(req:any, res:NextApiResponse){

    const body = JSON.parse(req?.body)

    const {qrCode,expiryDate, quantity, ticketSecret, venueName, communityVenueName, targetDate, communityName, price,} = body

    const {signerCert, signerKey, wwdr, signerKeyPassphrase} = await getCertificates()
    const pass = await PKPass.from({
        model: path.resolve(
            // __dirname,
            // "../../../../",
            './ticket.pass',
        ),
        certificates:{ 
            wwdr,
            signerKey,
            signerCert,
            signerKeyPassphrase
        }
    },
    {
        serialNumber: ticketSecret,
        organizationName: `Flexable —— ${communityName}`
    }
    )


    pass.setBarcodes({
        message: JSON.stringify(qrCode),
        format: "PKBarcodeFormatQR",
        altText: "Qr code for community"
    })

    // pass.headerFields.push(
    //     {
    //         "key": "communityName",
    //         "label": "Community", 
    //         "value": communityName,
             
    //     },
    // )  

    pass.primaryFields.push(
        {
            key: "venueName",
            label: "Venue", 
            value: communityVenueName,
            textAlignment: "PKTextAlignmentLeft", 
            
        },
    ) 

    pass.secondaryFields.push(
        {
            key: "communityName",
            label: "Community", 
            value: communityName,
            textAlignment: "PKTextAlignmentLeft", 
             
        },
    )
   
 

    pass.auxiliaryFields.push(
       
        // {
        //     "key": "ticketSecret",
        //     "value": ticketSecret,
        //     "label":'Ticket Secret',
        //     "row": 0 
        // }, 
        { 
            "key": "quantity",
            "value": `${quantity} Ticket(s)`,
            "label":'Quantity',
            "row": 0
        }, 
        {
            "key": "price",
            "value": `$${price}`,
            "label":'Price',
            "row": 0
        },
        { 
            "key": "validUntil",
            "value": targetDate, //  convert this to us timezone
            "label":'Valid Until',
            "row": 0
        },
    )
    

   


 
    pass.setExpirationDate(new Date(expiryDate))

    pass.setRelevantDate(new Date(targetDate))



    // pass.type = "eventTicket"
    
    const buffer = pass.getAsBuffer();

    // console.log(pass.props['barcodes'])
    
    // console.log('streaming...',buffer)
    res.status(200) 
    res.setHeader("Content-Type", pass.mimeType)
    res.send(buffer)

}  





