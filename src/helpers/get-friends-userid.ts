import { fetchRedis } from "./redis";

export default async function getFriendsByUserID(userId:string) {
    
        const friendIds = await fetchRedis('smembers',`user:${userId}:friends`) as string[] 
        
       const friends = await Promise.all(
        friendIds.map(async (friendId:string) => {
            const friend = await fetchRedis('get',`user:${friendId}`) as string
            const parsedFriend = JSON.parse(friend) as User
            return parsedFriend
        })
       ) 

       return friends
}