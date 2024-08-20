"use client"

import { pusherClient } from '@/utils/pusher'
import { cn, pusherKey } from '@/utils/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  intialMessages:Message[],
  sessionId:string
  sessionImage: string | null | undefined
  chatPartner: User,
  chatId:string
}

const Messages = ({intialMessages,sessionId,sessionImage,chatPartner,chatId}: Props) => {
  const [ messages, setMessages ] = useState<Message[]>(intialMessages)
  
  const scollableDiv = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    pusherClient.subscribe(pusherKey(`user:${chatId}:messages`))
  
    const messageHandler = (message:Message) => {
        setMessages((prev) => [message,...prev])
    }

    pusherClient.bind('incoming-message',messageHandler)
    
    return () => {
      pusherClient.unsubscribe(pusherKey(`user:${chatId}:messages`))
      pusherClient.unbind('incoming-message',messageHandler)
    }
  }, [chatId])

  return (
    <div 
    id='messages'
    className='flex flex-col-reverse h-full flex-1 gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
        <div ref={scollableDiv} className="">
            {
              messages?.map((message,index) => {
                const isCurrentUser = message.senderId == sessionId
                const hasNextMessageFromSameUser = messages[index-1]?.senderId === messages[index]?.senderId
                return (
                  <div 
                  className="chat-message"
                  key={`${message.id}-${message.timestamp}`}
                  >
                    <div 
                    className={cn('flex items-center',{
                      'justify-end':isCurrentUser
                    })}
                    >
                      <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2',{
                        'order-1 items-end':isCurrentUser,
                        'order-2 items-start':!isCurrentUser
                      })}>
                          <span className={cn('px-4 py-2 rounded-lg inline-block',{
                              'bg-indigo-600 text-white':isCurrentUser,
                              'bg-gray-200 text-gray-900':!isCurrentUser,
                              'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                              'rounded-bl-none':!hasNextMessageFromSameUser && !isCurrentUser
                            })}>
                              {message.text}{' '}
                              <span className='ml-2 text-xs text-gray-400'>
                                { format(message.timestamp,"HH:mm")}
                              </span>
                          </span>
                      </div>

                      <div className={cn('relative h-6 w-6',{
                        'order-1':!isCurrentUser,
                        'order-2':isCurrentUser,
                        'invisible':hasNextMessageFromSameUser
                      })}>
                          <Image 
                            fill
                            src={isCurrentUser ? (sessionImage as string): chatPartner.image}
                            alt={`Profile pic`}
                            referrerPolicy='no-referrer'
                            className="rounded-full"
                          />
                        </div>                      
                    </div>

                  </div>
                )
              })
            }
        </div>
    </div>
  )
}

export default Messages