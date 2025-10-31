import {postgrest} from "@/lib/postgrest";
import {PollDetails} from "@/lib/model/poll-details";

export const fetchPollDetails = async (poll_id: string): Promise<PollDetails | null> => {
    return (await (await postgrest())
            .from('poll_details')
            .select('*')
            .eq('id', poll_id)
            .single()
    ).data as PollDetails;
}
