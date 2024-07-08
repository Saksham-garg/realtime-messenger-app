"use client"
import React,{ ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
interface ProvidersInterface {
    children : ReactNode
}

const Providers:React.FC<ProvidersInterface> = ({ children }) => {
    return <>
        <Toaster position='top-center' reverseOrder={false} />
        {children}
    </>
}

export default Providers