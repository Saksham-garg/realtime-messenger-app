import { authOptions } from "@/utils/auth"
import { addFriendValidator } from "@/utils/validators/addFriendValidator"
import { getServerSession } from "next-auth"


export default async function POST(req:Request){
   
    try {
        const email = await req.json()
    
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

        const data = ( await requestFriend.json()) as { result: string | null }

        const isToAdd = data.result

        const session = await getServerSession(authOptions)

        if(!session){
            return new Response("Unauthorized",{status:401})
        }

        if(!isToAdd){
            return new Response("This person doesn't exist",{status:400})
        }

        if(isToAdd == session.user.id){
            return new Response("You cannot add yourself!",{status:400})
        }
        
    } catch (error) {
        
    }
    
}