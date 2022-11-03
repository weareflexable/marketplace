import {useState} from 'react'
import { useRouter } from 'next/router'


export default function usePath(){
    const {asPath,basePath} = useRouter();

    const currentPath = `${asPath}${basePath!==''? basePath:'/'}`

    return {currentPath}
}