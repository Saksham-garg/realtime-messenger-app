import { Icon, Icons } from "@/components/icons";
import SignOutButton from "@/components/SignOutButton";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import FriendRequestsSidebarOptions from "@/components/FriendRequestsSidebarOptions";
import { fetchRedis } from "@/helpers/redis";
import getFriendsByUserID from "@/helpers/get-friends-userid";
import SidebarChatList from "@/components/SidebarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
import { SidebarOption } from "@/types/typings";

type Props = {
  children: React.ReactNode;
};

const sidebarTabs: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

async function layout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) notFound();
  const friends = await getFriendsByUserID(session.user.id);
  const unseenFriendRequests = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_request`
    )) as User[]
  ).length;

  return (
    <div className="w-full h-screen flex">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarTabs}
          unseenRequestCount={unseenFriendRequests}
        />
      </div>
      <div className="hidden md:flex w-full h-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href={"/dashboard"} className="flex h-16 items-center gap-3 font-sans font-semibold">
          <Icons.Logo className="h-8 auto text-indigo-600" />
          <p>Dashboard</p>
        </Link>

        {friends?.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your chats
          </div>
        ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList friends={friends} sessionId={session.user.id} />
            </li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Overview
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {sidebarTabs.map((option) => {
                const Icon = Icons[option.Icon];
                return (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                );
              })}

              <li>
                <FriendRequestsSidebarOptions
                  initialFriendRequests={unseenFriendRequests}
                  sessionId={session.user.id}
                />
              </li>
            </ul>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="container py-12 sm:py-16 max-h-screen">
        {children}
      </aside>
    </div>
  );
}

export default layout;
