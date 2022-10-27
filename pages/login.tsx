import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
// import { toast } from "react-toastify";
import {useToast} from '@chakra-ui/react'
import { useRouter } from "next/router";
import { signIn, signInWithProvider } from "../utils/auth";
import { getPlatformPaseto ,setPlatformPaseto } from "../utils/storage";
import { getPaseto } from "../utils/platform/platform";
import supabase from "../utils/supabase";

const New = () => {
  // todo: states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast()

  // todo: functions
  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    console.log('you clicked me nigga')
    e.preventDefault();
    if (!email || !password) {
        toast({
            title: 'Login failed.',
            description: "One or more fields are missing",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
      return;
    }
    setIsSubmitting(true);
    const { error, session } = await signIn({ email, password });
    console.log('login session',session)
    if (error) {
      setIsSubmitting(false);
      toast({
        title: `${error.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    if (session) {
      setIsSubmitting(false);
      // getPaseto(supabase.auth.session().access_token).then(setPlatformPaseto);
      // const paseto = getPlatformPaseto();
      toast({
        title: `Login successful!`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      router.push(`/bookings`);
    }
  };

  const handleProviderLogin = async (provider:string) => {
    setIsSubmitting(true);
    // this redirects whenever it's succesful
    setIsSubmitting(true);
    const { error, session } = await signInWithProvider(provider);

    // everything from here downwards is proving to be very useless, because logic
    // _app.js is disrupting the entire flow

    // if (error) {
    //   setIsSubmitting(false); 
    //   toast.error(error.message);
    // }
    // if (user) {
    //   setIsSubmitting(false);
    //   const paseto = getPlatformPaseto()
    //   toast.success("Logged in successfully");
    //   router.push(`/https://localhost:3002/bookings/${paseto}`);
    setIsSubmitting(false); 
    }
  // };

  return (
    <section className="h-full bg-gradient-to-r from-black to-primary">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-end px-4pb-10  sm:pb-16 md:justify-center lg:pb-24 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="w-full max-w-xl xl:w-full xl:mx-auto mr-auto xl:max-w-xl">
              <h3 className="text-4xl font-bold text-white text-center lg:text-left max-w-[20rem] lg:mx-0 mx-auto leading-[150%]">
                <span className="text-secondary">Sign in</span>{" "}
                <span className="block lg:inline">& </span>
                <br className="hidden xl:block" />
                <span className="text-secondary">be Flexable</span>
              </h3>
              <ul className="flex flex-wrap justify-center lg:justify-start lg:grid lg:grid-cols-2 lg:gap-x-10 gap-5 mt-5">
                <li className="flex items-center space-x-3">
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Night life{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Restaurant{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Exclusive access{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white">
                    {" "}
                    Community{" "}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Log in to Dashboard
            </h2>
            <p className="mt-2 text-base text-gray-400">
              Don&apos;t have an account?
              <Link href="/register">
                <a
                  title=""
                  className="font-medium text-secondary transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline"
                >
                  Sign Up
                </a>
              </Link>
            </p>

            <form onSubmit={handleSignIn} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-400"
                  >
                    {" "}
                    Email{" "}
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-secondary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>

                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name=""
                      id=""
                      placeholder="Enter your email"
                      className="block w-full py-4 pl-10 pr-4 text-white placeholder-gray-500 transition-all duration-200 border-b-2 border-b-secondary  bg-primary focus:outline-none focus:border-white  caret-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-400"
                  >
                    {" "}
                    Password{" "}
                  </label>
                  <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-secondary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        />
                      </svg>
                    </div>

                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      name=""
                      id=""
                      placeholder="Enter password"
                      className="block w-full py-4 pl-10 pr-4 text-white placeholder-gray-500 transition-all duration-200 border-b-2 border-b-secondary  bg-primary focus:outline-none focus:border-white  caret-secondary"
                    />
                  </div>
                </div>

                <div>
                  <button
                    disabled={isSubmitting || !email || !password}
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-fuchsia-600 to-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3 space-y-3">
              <button
                onClick={() => handleProviderLogin("google")}
                type="button"
                className="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-black border-2 border-gray-200 rounded-md hover:bg-secondary focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
              >
                <div className="absolute inset-y-0 left-0 p-4">
                  <svg
                    className="w-6 h-6 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </div>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default New;
