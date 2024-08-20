"use client"
import { pusherClient } from '@/utils/pusher'
import { pusherKey } from '@/utils/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

type Props = {
    sessionId:string,
    incomingFriendRequests:incomingFriendRequests[]
}

const FriendRequests = ({incomingFriendRequests,sessionId}: Props) => {
    const router = useRouter()
    const [ friendRequests,setFriendRequests ] = useState<incomingFriendRequests[]>(incomingFriendRequests)


    useEffect(() => {
      pusherClient.subscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`))
    
      const friendRequestHandler = ({sendersId,sendersEmail}:incomingFriendRequests) => {
        setFriendRequests((prev) => [...prev,{sendersId,sendersEmail}])
      }

      pusherClient.bind('incoming_friend_requests',friendRequestHandler)
      
      return () => {
        pusherClient.unsubscribe(pusherKey(`user:${sessionId}:incoming_friend_requests`))
        pusherClient.unbind('incoming_friend_requests',friendRequestHandler)
      }
    }, [sessionId])
    

    const acceptFriend = async(senderId:string) => {
      await axios.post('/api/request/accept',{id:senderId})

      setFriendRequests((prev) => prev.filter(request => request.sendersId !== senderId))

      router.refresh()
    }
    const denyFriend = async (senderId:string) => {
      await axios.post(`/api/request/deny`,{id:senderId})
    
      setFriendRequests((prev) => prev.filter(request => request.sendersId !== senderId))

      router.refresh()
    }
  return (
    <>
    {friendRequests.length === 0 ? (
      <p className='text-sm text-zinc-500'>Nothing to show here...</p>
    ) : (
      friendRequests.map((request) => (
        <div key={request.sendersId} className='flex gap-4 items-center'>
          <UserPlus className='text-black' />
          <p className='font-medium text-lg'>{request.sendersEmail}</p>
          <button
            onClick={() => acceptFriend(request.sendersId)}
            aria-label='accept friend'
            className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <Check className='font-semibold text-white w-3/4 h-3/4' />
          </button>

          <button
            onClick={() => denyFriend(request.sendersId)}
            aria-label='deny friend'
            className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <X className='font-semibold text-white w-3/4 h-3/4' />
          </button>
        </div>
      ))
    )}
  </>
  )
}

export default FriendRequests