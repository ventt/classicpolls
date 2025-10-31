'use client';

import {signIn, signOut} from 'next-auth/react';
import {cn} from "@/lib/utils";

export function SignInButton({design = ''}) {
  return (
    <button
        className={cn("px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer text-white", design)}
      onClick={() => signIn('discord')}
    >
      Sign in with Discord
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition cursor-pointer"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}

