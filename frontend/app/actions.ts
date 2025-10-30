'use server'
import {extractContentRangeFromResponse} from "@/lib/postgrest";
import {getServerAuth} from "@/lib/auth";


export async function fetchPollsDetails(limit: number, offset: number, orderBy: string, asc: boolean) {
    if (limit > 100) {
        throw new Error('maximum limit should be greater than 100');
    }

    const url = new URL(process.env.API_URL_POSTGREST + '/poll_details');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('order', orderBy + '.' + (asc ? 'asc' : 'desc'));

    const headers = [
        ['Accept', 'application/json'],
        ['Content-Type', 'application/json'],
        ['Prefer', 'count=exact']
    ]

    const accessToken = (await getServerAuth())?.accessToken;

    if (accessToken) {
        headers.push(['Authorization', `Bearer ${accessToken}`]);
    }

    const response = await fetch(url, {
        headers: headers as HeadersInit,
        method: 'GET'
    });

    const range = extractContentRangeFromResponse(response);

    if (!range) {
        throw new Error('Invalid response');
    }

    return {
        data: await response.json(),
        count: range.count,
    };
}