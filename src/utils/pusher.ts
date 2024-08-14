import PusherClient from 'pusher-js'
import PusherServer from 'pusher'

console.log(process.env.NEXT_PUBLIC_PUSHER_KEY)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    useTLS:true
})

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster:process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    }
)
console.log(pusherClient)