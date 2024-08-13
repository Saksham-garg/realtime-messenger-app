"use client"

import { chatHrefConstructor } from '@/utils/utils'
import { usePathname, useRouter } from 'next/navigation'
import React,{ useEffect, useState } from 'react'

type Props = {
    friends: User[],
    sessionId:string
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