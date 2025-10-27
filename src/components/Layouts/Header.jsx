import React from "react";
import {
  UserButton,
  useUser,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Github, Menu } from "lucide-react";
import NotificationMenu from "../UI/NotificationMenu";

const Header = ({ onMenuToggle }) => {
  const { isLoaded, user } = useUser();
  const GithubLogo = () => (
    <div class="group relative">
      <button>
        <svg
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          class="w-8 hover:scale-125 duration-200 hover:stroke-blue-500"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </button>
      <span
        class="absolute -top-14 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-white py-2 text-sm font-bold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
      >
        GitHub<span></span>
      </span>
    </div>
  );

  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className=" cursor-pointer flex items-center ml-4 lg:ml-0">
              {/* <Github className="w-8 h-8 text-gray-900" />
               */}
              <GithubLogo />
              <span className="ml-2 cursor-pointer text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
                RepoPulse
              </span>
            </div>
          </div>
          

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            
            
            <NotificationMenu />

            {!isLoaded ? (
              <div className="animate-pulse bg-gray-200 rounded-lg w-20 h-8"></div>
            ) : (
              <>
                <SignedOut>
                  <div className="flex items-center space-x-3">
                    <SignInButton mode="modal">
                      <button className="text-sm text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:border-gray-400 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 hidden sm:block">
                      Hi, {user?.firstName || user?.username || "User"}!
                    </span>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
