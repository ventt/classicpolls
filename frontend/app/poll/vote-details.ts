// @ts-ignore
import {GenericTable} from '@supabase/postgrest-js/src/types'
import {postgrest} from "@/lib/postgrest";

export interface VoteDetails extends GenericTable {
    choice: boolean,
    created_at: string,
    user: {
        name: string,
        image: string,
    }
}

export const fetchVoteDetails = async (poll_id: string, limit: number) => {
    const response = await postgrest()
        .from('vote')
        .select('user:users(name,image),choice,created_at')
        .order('created_at', {ascending: false})
        .eq('poll_id', poll_id)
        .limit(limit)
        .overrideTypes<any>()
    console.log(response)
    return response.data as VoteDetails[];
}

