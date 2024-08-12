import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import db from "@/utils/db"
import { getServerSession } from "next-auth"
import { z, ZodError } from "zod"


export async function POST(req:Request){
    try {
        const body = await req.json()

        const { id: idToAdd } = z.object({id:z.string()}).parse(body)

        const session = await getServerSession(authOptions)
        if(!session){
            return new Response("Unauthorized",{ status: 401 })
        }

        // Check if user is already friends
        const isAlreadyFriends = await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)

        if(isAlreadyFriends){
            return new Response("You are already friends with this user.",{ status: 400 })
        }

        // Check if friend request has been send or not
        const hasFriendRequest = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_request`,idToAdd)

        if(!hasFriendRequest){
            return new Response("No Friend Request",{ status: 400 })
        }
        
        db.sadd(`user:${session.user.id}:friends`,idToAdd)
        db.sadd(`user:${idToAdd}:friends`,session.user.id)
        db.srem(`user:${session.user.id}:incoming_friend_request`,idToAdd)

        return new Response('OK')
    } catch (error) {
        console.log(error)

        if(error instanceof ZodError){
            return new Response("Invalid Inputs",{ status: 422 })
        }
        return new Response('Invalid request', { status: 400 })
    }
}