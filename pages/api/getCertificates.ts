import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs/promises'
import path from 'path'

export default async function getCertificates(){
    let signerCert: string;
	let signerKey: string;
	let wwdr: string;
	let model: string;
	let signerKeyPassphrase: string;

	// if (process.env.IS_OFFLINE) {
	// 	console.log("Fetching Certificates locally");

		// ****************************************************************** //
		// *** Execution path offline is `examples/serverless/.build/src` *** //
		// ****************************************************************** //

		[signerCert, signerKey, wwdr, signerKeyPassphrase] = await Promise.all([
			fs.readFile(
				path.resolve(
					// __dirname,
					// "../",
					"./certs/signerCert.pem",
				),
				"utf-8",
			),
			fs.readFile(
				path.resolve(
					// __dirname,
					// "../../",
					"./certs/signerKey.key",
				),
				"utf-8",
			),
            
			fs.readFile( 
				path.resolve(
					// __dirname,
					// "../../",
					"./certs/wwdr.pem",
				),
				"utf-8",
			),
			Promise.resolve('1111'), 
          
		]);
	
		// @TODO
	 return {signerCert, signerKey, wwdr, signerKeyPassphrase}

	// return {
	// 	signerCert,
	// 	signerKey,
	// 	wwdr,
	// 	signerKeyPassphrase,
	// };

}