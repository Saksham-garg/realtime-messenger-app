import { clsx,ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...input: ClassValue[]){
    return twMerge(clsx(input))
}

export function chatHrefConstructor(chatId1:string,chatId2:string){
    const sortedIds = [ chatId1,chatId2 ].sort()
    return `${sortedIds[0]}--${sortedIds[1]}`
}

export function pusherKey(key:string){
    return key.replace(/:/g,'__')
}