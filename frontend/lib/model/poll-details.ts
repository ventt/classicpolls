// @ts-ignore
import {GenericTable} from '@supabase/postgrest-js/src/types'

export interface PollDetails extends GenericTable {
    id: string,
    title: string,
    description?: string,
    category_name: string,
    upvotes: number,
    downvotes: number,
    total_votes: number,
    upvote_ratio: number,
    approval_score: number,
}
