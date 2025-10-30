import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AdLessLayout from "@/app/adless-layout";
import PollList from "@/components/PollList";
import {fetchCategories} from "@/lib/postgrest/category";
import {getServerAuth} from "@/lib/auth";
import {fetchPollsDetails} from "@/app/actions";
import {redirect} from "next/navigation";


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
        <AdLessLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <SiteHeader/>


                {!!pollDetails.count ? (
                    <>
                        <div className="flex items-center justify-between mt-2">
                            <h2 className="text-xl font-semibold text-white">My Polls</h2>
                            <Link
                                href="/new-poll"
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white"
                            >
                                New Poll
                            </Link>
                        </div>
                        <PollList initPollDetailsList={pollDetails.data} initTotal={pollDetails.data}
                                  initPageSize={pollDetails.count} categories={categories}
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

            </main>
        </AdLessLayout>
    );
}
