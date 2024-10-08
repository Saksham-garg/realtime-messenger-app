"use client";

import { pusherClient } from "@/utils/pusher";
import { chatHrefConstructor, pusherKey } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import { Message } from "@/utils/validators/message";
import Image from "next/image";

type Props = {
  friends: User[];
  sessionId: string;
};

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SidebarChatList = ({ friends, sessionId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  useEffect(() => {
    pusherClient.subscribe(pusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(pusherKey(`user:${sessionId}:friends`));

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;
      toast.custom((t) => {
        return (
          <UnseenChatToast
            t={t}
            sessionId={sessionId}
            senderId={message.senderId}
            senderImg={message.senderImg}
            senderName={message.senderName}
            senderMessage={message.text}
          />
        );
      });

      setUnseenMessages((prev) => [...prev, message]);
    };

    const friendHandler = (new_friend: User) => {
      setActiveChats((prev) => [...prev, new_friend]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", friendHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(pusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", friendHandler);
    };
  }, [pathname, sessionId, router]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (message) => message.senderId === friend.id
        ).length;

        return (
          <li key={friend.id} className="rounded-lg bg-gray-50 border border-indigo-200">
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <Image
                width={20}
                height={20}
                referrerPolicy="no-referrer"
                alt={`${friend?.name} profile photo`}
                src={friend?.image}
                className="rounded-full"
              />
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs h-5 w-5 rounded-full text-white flex items-center justify-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
