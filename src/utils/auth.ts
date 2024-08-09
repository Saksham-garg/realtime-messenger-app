import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import db from './db'
// import { fetchRedis } from '@/helpers/redis'

function getGoogleAuthProvider(){
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length == 0){
        throw new Error("Google Client Id not found!")
    }

    if(!clientSecret || clientSecret.length == 0){
        throw new Error("Google Client Secret not found!")
    }

    return { clientId,clientSecret }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/login'
    },
    providers:[
        GoogleProvider({
            clientId: getGoogleAuthProvider().clientId,
            clientSecret: getGoogleAuthProvider().clientSecret
        })
    ],
    secret:process.env.NEXTAUTH_URL,
    callbacks:{
        async jwt({token,user}){

            const dbUserResult = ( await db.get(`user:${token.id}`) ) as User | null

            // const dbUserResult =  (await fetchRedis('get', `user:${token.id}`)) as
            // | string
            // | null
    
            if (!dbUserResult) {
                if (user) {
                  token.id = user!.id
                }
        
                return token
              }
            //   const dbUser = JSON.parse(dbUserResult) as User

              return {
                id: dbUserResult.id,
                name: dbUserResult.name,
                email: dbUserResult.email,
                picture: dbUserResult.image,
              }
        },
        async session({ session, token }) {
            if (token) {
              session.user.id = token.id
              session.user.name = token.name
              session.user.email = token.email
              session.user.image = token.picture
            }
      
            return session
        },
        redirect() {
            return '/dashboard'
        },
    }
}