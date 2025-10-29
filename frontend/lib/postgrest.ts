import {PostgrestClient} from '@supabase/postgrest-js'

const regex = /^(\d+)-(\d+)\/(\d+)$/;

/**
 * Create a postgrest client with the session
 * @param jwtToken
 */
export function postgrest(jwtToken?: string) {
    return new PostgrestClient(process.env.API_URL_POSTGREST!, {
        // @ts-ignore
        headers: {...jwtToken ? {Authorization: `Bearer ${jwtToken}`} : {}},
    })
}

export function extractContentRangeFromResponse(response: Response) {
    const contentRange = response.headers.get('content-range');
    const match = contentRange?.match(regex);

    if (match) {
        const [_, a, b, c] = match;

        return {
            from: parseInt(a),
            to: parseInt(b),
            count: parseInt(c)
        }
    }

    return null;
}
