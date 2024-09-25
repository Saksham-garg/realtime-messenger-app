"use client";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong while login!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-black text-white h-screen w-screen relative">
        {/* value proposition section */}
        <p className="absolute top-8 left-10 flex gap-3 items-center justify-center font-mono font-medium text-lg">
          <img src="/logo.svg" alt="logo" height={20} width={20}></img>
          FriendZone
        </p>

        <div className="w-full flex flex-col items-center justify-between max-w-lg space-y-8 h-full py-20">
          <div className="flex flex-col items-center gap-8">
            {/* value proposition section */}
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-30 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-96"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(30%-11rem)] aspect-[1155/678] w-[46.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(69%-30rem)] sm:w-[72.1875rem]"
                />
              </div>

              <div>
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                  <div className="flow-root">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 sm:text-6xl text-4xl text-pretty text-center ">
                      Connect Friends{" "}
                      <span className="font-bold">easily & quickly</span>
                    </div>
                    <p className="text-base font-normal text-[#B9C1BE] mt-5 text-center">
                      Our chat app is the perfect way to stay connected with
                      friends and family.
                    </p>
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-96"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(30%-13rem)] aspect-[1155/678] w-[46.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(30%-36rem)] sm:w-[72.1875rem]"
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl tracking-tighter">Sign in to your account</h1>
          <Button
            className="max-w-sm w-full border-white ring-white ring-offset-2 ring-[0.5px]"
            onClick={handleGoogleSignIn}
            isLoading={isLoading}
          >
            {!isLoading ? (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            ) : null}{" "}
            Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
