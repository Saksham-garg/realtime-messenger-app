import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/utils/auth";
import db from "@/utils/db";
import { getServerSession } from "next-auth";
import { z, ZodError } from "zod";


export async function POST(req:Request){
    try {
        const body = await req.json()
        const session = await getServerSession(authOptions)

        if(!session){
            return new Response("Unauthorized",{ status: 401 })
        }

        const { id: idToRemove } = z.object({id: z.string()}).parse(body)
        
        const hasFriendRequest = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_request`,idToRemove)

        if(!hasFriendRequest){
            return new Response("No friend request",{ status: 400 })
        }

        await db.srem(`user:${session.user.id}:incoming_friend_request`,idToRemove)

        return new Response('OK')
    } catch (error) {
        if(error instanceof ZodError){
            return new Response("Invalid Inputs",{ status: 422 })
        }

        return new Response("Invalid request",{ status: 400 })
    }
}