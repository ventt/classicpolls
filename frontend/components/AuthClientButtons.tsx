'use client';

import { signIn, signOut } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
      onClick={() => signIn('discord')}
    >
      Sign in with Discord
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}

