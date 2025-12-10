export enum OrderByColumns {
    Upvotes = "upvotes",
    Downvotes = "downvotes",
    ApprovalScore = "approval_score",
    TotalVotes = "total_votes",
    Recent = "created_at",
}

export const OrderByOptions = new Map<string, { orderBy: OrderByColumns; ascending: boolean }>([
    ['most_approved', {orderBy: OrderByColumns.ApprovalScore, ascending: false}],
    ['least_approved', {orderBy: OrderByColumns.ApprovalScore, ascending: true}],
    ['most_recent', {orderBy: OrderByColumns.Recent, ascending: false}],
    ['least_recent', {orderBy: OrderByColumns.Recent, ascending: true}],
    ['most_popular', {orderBy: OrderByColumns.TotalVotes, ascending: false}],
    ['least_popular', {orderBy: OrderByColumns.TotalVotes, ascending: true}],
    ['most_upvotes', {orderBy: OrderByColumns.Upvotes, ascending: false}],
    ['most_downvotes', {orderBy: OrderByColumns.Downvotes, ascending: false}],
]);

export const defaults = {
    limit: 20,
    orderBy: 'most_popular',
}