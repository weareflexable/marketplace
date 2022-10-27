import React from "react";
import Link from "next/link";
import { FaHandshake } from "react-icons/fa";

const Landing = () => {
  return (
    <main className="h-full bg-gradient-to-b from-black via-black to-primary flex flex-col">
      <div className=" flex items-center pt-16 md:pt-32 px-6 flex-col">
        <h1 className="text-[#8cb9b4] text-4xl text-center leading-[130%] w-5/6 md:text-5xl ">
          Why wait in the line when you could just... not.
        </h1>
        <p className="text-gray-400 w-4/6 md:w-3/6 text-center leading-[150%] mt-5 mb-8">
          
        </p>
        <Link href="/register">
          <a className=" px-4 py-1 bg-secondary text-primary rounded-md font-bold flex items-center justify-center gap-3">
            <FaHandshake /> Join Now
          </a>
        </Link>
        <p className="text-gray-500 my-4 text-xs">or</p>
        <Link href="/login">
          <a className="text-secondary opacity-75 font-light text-sm">
            Sign in
          </a>
        </Link>

        {/* <p className="text-gray-500 text-xs mt-3 flex items-center justify-center gap-3">
          Already joined?{" "}
          <Link href="/login">
            <a className="text-secondary text-base">Sign in</a>
          </Link>
        </p> */}
      </div>
      <div className="flex items-center justify-center px-6 grow">
        <p className="text-4xl lg:text-6xl md:text-5xl text-center leading-[150%] bg-clip-text font-bold font-heading bg-gradient-to-r from-gray-300 text-transparent via-accent to-secondary">
          #WeGetYouIn
        </p>
      </div>
    </main>
  );
};

export default Landing;
