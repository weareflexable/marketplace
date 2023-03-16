import {PKPass} from 'passkit-generator'
import { NextRequest, NextResponse } from 'next/server'
import getCertificates from './getCertificates'
import path from 'path'
import { NextApiResponse } from 'next'
export default async function handler(req:any, res:NextApiResponse){

    const body = JSON.parse(req?.body)

    console.log('boodddyyy',body)
    const {qrPayload,expiryDate, location} = body
    // payload structure
    // {
    //     location,
    //     qrPayload,
    //     expirationDate,
    // }
    // const data = await fetch()
    const {signerCert, signerKey, wwdr, signerKeyPassphrase} = await getCertificates()
    const pass = await PKPass.from({
        model: path.resolve(
            __dirname,
            "../../../../",
            'pages/api/passkit/models/ticket.pass',
        ),
        certificates:{ 
            wwdr,
            signerKey,
            signerCert,
            signerKeyPassphrase
        }
    })

    // pass.set
    pass.headerFields.push(
        {
            key: "header1",
            label: "Event",
            value: "Flexable natural line skips",
            textAlignment: "PKTextAlignmentCenter",
        },
        {
            key: "header2",
            label: "Description",
            value: "Best service in Syracuse",
            textAlignment: "PKTextAlignmentCenter",
        },
    );

    pass.setLocations(location)

    pass.setBarcodes({
        message: `${JSON.stringify(qrPayload)}`,
        format: "PKBarcodeFormatQR",
        altText: "Qr code for entry"
    })

    pass.setExpirationDate(new Date(expiryDate))

    pass.type = "eventTicket"

    console.log('mimeType', pass.mimeType)
    
    const buffer = pass.getAsBuffer();  
    console.log('streaming...',buffer)
    res.status(200)
    res.setHeader("Content-Type", pass.mimeType)
    // res.setHeader("Content-Dispostion", 'attachment; filena.pkpass')
    res.send(buffer)

}  





