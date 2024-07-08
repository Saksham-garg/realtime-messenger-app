"use client"
import React, { useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/utils/validators/addFriendValidator'
import axios, { AxiosError } from 'axios'
import {z, ZodError } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const AddFriendButton:React.FC = () => {

  type FormData = z.infer<typeof addFriendValidator>

  const [ showSuccessMessage,setShowSuccessMessage ] = useState<Boolean>(false)

  const { register,handleSubmit,setError,formState:{errors} } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator)
  })

  const addFriend = async( email:string ) => {
    try {
      const validatedEmail = addFriendValidator.parse({email})

      await axios.post('api/friend/add',{
        email:validatedEmail
      })

      setShowSuccessMessage(true)
    } catch (error) {
        if(error instanceof AxiosError){
          setError('email',{message:error.response?.data})
          return
        }

        if(error instanceof ZodError){
          setError('email',{ message: error.message})
          return
        }
        setError('email',{message:"Something went wrong!"})
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}  className='max-w-sm'>
    <label
      htmlFor='email'
      className='block text-sm font-medium leading-6 text-gray-900'>
      Add friend by E-Mail
    </label>

    <div className='mt-2 flex gap-4'>
      <input
        {...register('email')}
        type='text'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='you@example.com'
      />
      <Button>Add</Button>
    </div>
    <p className='mt-1 text-sm text-red-600'>{ errors.email?.message}</p>
    {
      showSuccessMessage ? 
      <p className='mt-1 text-sm text-green-600'>Friend Request sent!</p> : null
    }
  </form>
  )
}

export default AddFriendButton