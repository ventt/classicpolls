import {getServerAuth} from "@/lib/auth";
import {NextRequest} from "next/server";

/**
 * API route to fetch updated poll votes for a list of poll IDs
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest) {
    if (!request.nextUrl.searchParams.get('poll_ids')) {
        return new Response('poll_ids parameter is required', {status: 400});
    }

    const pollIdList = request.nextUrl.searchParams.get('poll_ids')?.split(',').slice(0, 10); // limit to 10 ids

    if (!pollIdList) {
        return new Response('invalid poll_ids parameter', {status: 400});
    }

    const url = new URL(process.env.API_URL_POSTGREST + '/poll_details');

    url.searchParams.append('select', [
        'id',
        'user_choice',
        'upvotes',
        'downvotes',
        'total_votes',
    ].join(','));
    url.searchParams.append('id', 'in.(' + pollIdList.join(',') + ')');

    const headers = [
        ['Accept', 'application/json'],
        ['Content-Type', 'application/json'],
    ]

    const accessToken = (await getServerAuth())?.accessToken;

    if (accessToken) {
        headers.push(['Authorization', `Bearer ${accessToken}`]);
    }

    const response = await fetch(url, {
        headers: headers as HeadersInit,
        method: 'GET',
    });

    if (response.ok) {
        return Response.json(await response.json());
    } else {
        return new Response(response.statusText, {status: response.status});
    }
}
