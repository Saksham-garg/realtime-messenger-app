"use client"
import React, { ButtonHTMLAttributes, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader, LogOut } from 'lucide-react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const SignOutButton = (props: Props) => {
    const [ isLoading,setIsLoading ] = useState<boolean>(false)
  return (
    <Button {...props} variant={"ghost"} onClick={async() => {
        try {
            setIsLoading(true)
            signOut()
        } catch (error) {
            toast.error("There is some error in signing out.")
        }finally{
            setIsLoading(false)
        }
    }}>
        {
            !isLoading ?
            (
                <LogOut />
            ):
            (
                <Loader className='h-4 w-4 animate-spin' />
            )
        }
    </Button>
  )
}

export default SignOutButton