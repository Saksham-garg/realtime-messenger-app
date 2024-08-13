import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import db from "@/utils/db"
import { messageValidator } from "@/utils/validators/message"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"

export async function POST(req: Request){

    try {
        const body = await req.json()
        const session = await getServerSession(authOptions)

        const { text,chatId } = body

        if(!session) return new Response('Unauthorized',{ status: 401 })

        if(!chatId.includes('--')){
            return new Response("Invalid Chat Id",{ status: 400 })
        }

        const [ userId1,userid2 ] = chatId.split('--')

        if(userId1 !== session.user.id && userid2 == !session.user.id){
            return new Response("Unauthorized",{ status: 401 })
        }
    

        const doesUser1Exists = await fetchRedis('sismember',`user:${userId1}`) 
        const doesUser2Exists = await fetchRedis('sismember',`user:${userid2}`)

        if(!doesUser1Exists && !doesUser2Exists){
            return new Response("Invalid Users",{ status: 400 })
        }

        const friendId = session.user.id == userId1 ? userid2 : userId1

        const friendsList = (await fetchRedis('smembers',`user:${session.user.id}:friends`)) as string[]
        console.log(friendsList)
        const isFriends = friendsList.includes(friendId)
        if(!isFriends){
            return new Response("Cannot send message to unknown user.",{ status: 400 })
        }

        // send message

        const timestamp = Date.now()

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            receiverId: friendId,
            text:text,
            timestamp:timestamp
        }

        const message = messageValidator.parse(messageData)

        await db.zadd(`chat:${chatId}:messages`,{
            score:timestamp,
            member: JSON.stringify(message)
        })
        
        return new Response('OK')
    } catch (error) {
        if(error instanceof Error){
            return new Response(error.message,{ status:500 })
        }        

        return new Response("Internal Server Error",{ status:500 })
    }
}