import {getServerAuth} from "@/lib/auth";
import {extractContentRangeFromResponse} from "@/lib/postgrest";

export async function fetchPollsDetails(limit: number, offset: number, orderBy: string, asc: boolean, category?: string | null, searchTerm?: string | null, user_sub?: string | null) {
    if (limit > 100) {
        throw new Error('maximum limit should be greater than 100');
    }

    const url = new URL(process.env.API_URL_POSTGREST + '/poll_details');

    url.searchParams.append('select', [
        'id',
        'title',
        'description',
        'created_at',
        'category_name',
        'user_choice',
        'upvotes',
        'downvotes',
        'total_votes',
        'upvote_ratio',
        'approval_score',
    ].join(','));
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('order', orderBy + '.' + (asc ? 'asc' : 'desc'));

    if (category) {
        url.searchParams.append('category_name', 'eq.' + category);
    }

    if (searchTerm) {
        url.searchParams.append('search_vector', 'wfts.' + searchTerm.trim());
    }

    if (user_sub) {
        url.searchParams.append('user_sub', 'eq.' + user_sub);
    }


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
        method: 'GET',
    });

    const range = extractContentRangeFromResponse(response);

    return {
        data: await response.json(),
        count: !range ? 0 : range.count,
    };
}