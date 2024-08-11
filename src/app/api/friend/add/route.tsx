import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import db from "@/utils/db"
import { addFriendValidator } from "@/utils/validators/addFriendValidator"
import { getServerSession } from "next-auth"
import { ZodError } from "zod"


export async function POST(req:Request){
   
    try {
        const { email }= await req.json()
        const validatedEmail = addFriendValidator.parse(email)
    
        if(!validatedEmail){
            return new Response("Invalid email")
        }
    
        const requestFriend = await fetch(
            `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${validatedEmail.email}`,
            {
                headers:{
                    Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                },
                cache:'no-store'
            }
        )
        console.log(`user:email:${validatedEmail.email}`)
        const idToAdd = ( await fetchRedis('get',`user:email:${validatedEmail.email}`)) as ( string | null)
    
        console.log(idToAdd)
        // const data = ( await requestFriend.json()) as { result: string | null }

        // const idToAdd = data.result

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response("Unauthorized",{status:401})
        }

        if(!idToAdd){
            return new Response("This person doesn't exist",{status:400})
        }

        if(idToAdd == session.user.id){
            return new Response("You cannot add yourself!",{status:400})
        }

        // check if the user already added
        const isAlreadyAdded = ( await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)) as ( 0 | 1)

        if(isAlreadyAdded){
            return new Response("This person is already your friend",{ status: 400})
        }
        
        // Valid request, send friend request

        db.sadd(`user:${idToAdd}:incoming_friend_request`,session.user.id)

        return new Response('OK')
    } catch (error) {
        if(error instanceof ZodError){
            return new Response("Invalid Input payload",{ status: 422})
        }

        return new Response("Invalid request",{ status:400 })
    }
}