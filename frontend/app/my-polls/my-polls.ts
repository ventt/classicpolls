'use server'

import {getServerAuth} from "@/lib/auth";

export async function deletePoll(id: string): Promise<void> {
    const url = new URL(process.env.API_URL_POSTGREST + '/poll');
    url.searchParams.set('id', 'eq.' + id);
    const headers = [
        ['Accept', 'application/json'],
        ['Content-Type', 'application/json'],
    ]
    const accessToken = (await getServerAuth())?.accessToken;
    if (accessToken) {
        headers.push(['Authorization', `Bearer ${accessToken}`]);
    }
    await fetch(url, {
        headers: headers as HeadersInit,
        method: 'DELETE'
    })
}