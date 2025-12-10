'use server'
import {postgrest} from "@/lib/postgrest";


export async function addPollVote(pollId: string, choice: boolean) {
    return (await postgrest()).rpc('add_poll_vote', {p_poll_id: pollId, p_choice: choice});
}