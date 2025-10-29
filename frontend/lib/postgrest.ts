import {PostgrestClient} from '@supabase/postgrest-js'

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
