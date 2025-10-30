export interface PollDetails {
    id: string,
    title: string,
    description?: string,
    category_name: string,
    upvotes: number,
    downvotes: number,
    total_votes: number,
    upvote_ratio: number,
    approval_score: number,
    user_choice: boolean | null,
    created_at: string,
}
