import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { Message, messageArrayValidator } from '@/utils/validators/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
    params: {
        chatId: string
    }
}

const getChatMessages = async (chatId: string) => {
    try {
        const result: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1)

        const dbMessages = result.map((message) => JSON.parse(message) as Message)
        
        return dbMessages

    } catch (error) {
        notFound()
    }
}

const page = async ({ params }: Props) => {

    const session = await getServerSession(authOptions)

    if (!session) notFound()

    const { chatId } = params

    const [userId1, userId2] = chatId.split('--')
    const chatPartnerId = session.user.id == userId1 ? userId2 : userId1
    const getChatPartner = await fetchRedis('get', `user:${chatPartnerId}`) as string
    const chatPartner = JSON.parse(getChatPartner) as User
    const initialMessages = await getChatMessages(chatId)
    
    return (
        <div className='flex-1 flex flex-col justify-between h-full max-h-[calc(100vh-6rem)]'>
            <div className="flex sm:items-center justify-between border-gray-200 border-b-2 py-3">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                            <Image  
                            fill
                            referrerPolicy='no-referrer'
                            alt={`${chatPartner?.name} profile photo`}
                            src={chatPartner?.image}
                            className='rounded-full'
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className='text-gray-700 mr-3 font-semibold'>{chatPartner?.name}</span>
                        </div>
                        <span className='text-sm text-gray-600'>{chatPartner?.email}</span>
                    </div>
                </div>
            </div>
            <Messages intialMessages={initialMessages} sessionId={session.user.id} sessionImage={session.user.image} chatPartner={chatPartner} chatId={chatId}/>
            <ChatInput chatPartner={chatPartner} chatId={chatId}/>
        </div>
    )
}

export default page