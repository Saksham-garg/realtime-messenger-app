"use client"

import { pusherClient } from '@/utils/pusher'
import { chatHrefConstructor, pusherKey } from '@/utils/utils'
import { usePathname, useRouter } from 'next/navigation'
import React,{ useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

type Props = {
    friends: User[],
    sessionId:string
}

interface ExtendedMessage extends Message {
    senderImage:string
    senderName:string
}

const SidebarChatList = ({ friends,sessionId }: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const [ unseenMessages,setUnseenMessages ] = useState<Message[]>([])

    useEffect(() => {
      if(pathname?.includes('chat')){
        setUnseenMessages((prev) => {
            return prev.filter((msg) => !pathname.includes(msg.senderId))
        })
      }
    }, [pathname])
    
    useEffect(() => {
        pusherClient.subscribe(pusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(pusherKey(`user:${sessionId}:friends`))

        const chatHandler = (message:ExtendedMessage) => {
            const shouldNotify = (pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId,message.senderId)}`)

            if(!shouldNotify) return

            toast.custom((t) => {
                return <UnseenChatToast 
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImage}
                    senderName={message.senderName}
                    senderMessage={message.text}
                />
            })

            setUnseenMessages((prev) => [...prev,message])
        }

        const friendHandler = () => {
            router.refresh()
        }

        pusherClient.bind('new_message',chatHandler)
        pusherClient.bind('new_friend',friendHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(pusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_message',chatHandler)
            pusherClient.unbind('new_friend',friendHandler)
        }
    },[pathname,sessionId,router]) 

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {
            friends.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((message) => message.senderId === friend.id).length 

                return (
                    <li key={friend.id}>
                        <a href={`/dashboard/chat/${chatHrefConstructor(sessionId,friend.id)}`} className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                            {friend.name}
                            {
                                unseenMessagesCount > 0 ? (
                                    <div className="bg-indigo-600 font-medium text-xs h-4 w-4 rounded-full text-white flex items-center justify-center"></div>
                                ):null
                            }
                        </a>
                    </li>
                )
            })
        }
    </ul>
  )
}

export default SidebarChatList