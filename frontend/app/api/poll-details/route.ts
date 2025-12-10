import {NextRequest} from "next/server";
import {fetchPollsDetails} from "@/lib/data/poll-details";

export async function GET(request: NextRequest) {
    const reqSearchParams = request.nextUrl.searchParams;

    const limitParam = reqSearchParams.get('limit');
    const offsetParam = reqSearchParams.get('offset');
    const orderByParam = reqSearchParams.get('orderBy');
    const ascParam = reqSearchParams.get('asc');
    const categoryParam = reqSearchParams.get('category');
    const searchTermParam = reqSearchParams.get('searchTerm');
    const userSubParam = reqSearchParams.get('user_sub');

    const limit: number = limitParam ? Number(limitParam) : 20;
    const offset: number = offsetParam ? Number(offsetParam) : 0;
    const orderBy: string = orderByParam ?? 'created_at';
    const asc: boolean = ascParam ? ascParam === 'true' : false;
    const category: string | null = categoryParam ?? null;
    const searchTerm: string | null = searchTermParam ?? null;
    const user_sub: string | null = userSubParam ?? null;

    return Response.json(await fetchPollsDetails(limit, offset, orderBy, asc, category, searchTerm, user_sub));
}
