import {PKPass} from 'passkit-generator'

import getCertificates from './getCertificates'
import path from 'path'
import { NextApiResponse } from 'next'
import dayjs from 'dayjs'
import exp from 'constants'

export default async function handler(req:any, res:NextApiResponse){

    const body = JSON.parse(req?.body)

    const {qrCode,expiryDate, quantity, eventName, price, street, location} = body

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
    })

    // pass.set
    // pass.headerFields.push(
    //     {
    //         key: "header1",
    //         label: "Event",
    //         value: "Flexable natural line skips",
    //         textAlignment: "PKTextAlignmentCenter",
    //     },
    //     {
    //         key: "header2",
    //         label: "Description",
    //         value: "Best service in Syracuse",
    //         textAlignment: "PKTextAlignmentCenter",
    //     },
    // );

    pass.setLocations(location)

    pass.setBarcodes({
        message: JSON.stringify(qrCode),
        format: "PKBarcodeFormatQR",
        altText: "Qr code for bars"
    })


    pass.secondaryFields.push({

            "key": "location",
            "label": "LOCATION",
            "value": street
        
    })

    pass.auxiliaryFields.push(
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
            "key": "validOn",
            "value": dayjs(expiryDate).format("MM DD, YYYY"),
            "label":'Valid On',
            "row": 0
        },
    )
    

    pass.primaryFields.push({
        key: "Name",
        label: "Service Name",
        value: eventName,
        textAlignment: "PKTextAlignmentLeft",
    }) 
 
    pass.setExpirationDate(new Date(expiryDate))

    pass.setRelevantDate(new Date(expiryDate))

    // pass.type = "eventTicket"
    
    const buffer = pass.getAsBuffer();

    // console.log(pass.props['barcodes'])
    
    // console.log('streaming...',buffer)
    res.status(200) 
    res.setHeader("Content-Type", pass.mimeType)
    res.send(buffer)

}  





