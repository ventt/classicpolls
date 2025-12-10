import Link from "next/link";
import {fetchCategories} from "@/lib/postgrest/category";
import {getServerAuth} from "@/lib/auth";
import {redirect} from "next/navigation";
import PollListContainer from "@/components/PollListContainer";
import {fetchPollsDetails} from "@/lib/data/poll-details";


export default async function MyPollsPage() {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/my-polls");
    }
    const initPageSize = 20
    const categories = await fetchCategories();
    const pollDetails = await fetchPollsDetails(initPageSize, 0, 'approval_score',
        false, null, null, session?.user.id);


    return (
        <>
            {!!pollDetails.count ? (
                <>
                    <div className="flex items-center justify-between mt-2">
                        <h2 className="text-xl font-semibold text-white">My Polls</h2>
                        <Link
                            href="/new-poll"
                            className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-600 transition text-white"
                        >
                            New Poll
                        </Link>
                    </div>
                    <PollListContainer
                        initPollDetailsList={pollDetails.data}
                        initTotal={pollDetails.count}
                        categories={categories}
                        isUsersList={true}
                        userSub={session?.user.id}/>
                </>
            ) : (
                <div className="flex items-center justify-center">
                    <div className="flex">
                        <h3 className="text-4xl pt-10 font-semibold text-white text-center">You don't have any
                            polls</h3>

                    </div>
                </div>
            )}
        </>
    );
}
