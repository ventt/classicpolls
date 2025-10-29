import SiteHeader from "@/components/SiteHeader";
import AdLayout from "@/app/ad-layout";
import {fetchCategories} from "@/lib/postgrest/category";
import {postgrest} from "@/lib/postgrest";
import {PollDetails} from "@/lib/model/poll-details";
import PollCard from "@/components/PollCard";
import {getServerSession} from "next-auth";


export default async function Page() {
    const categories = await fetchCategories();
    const session = await getServerSession();
    const polls = (await postgrest()
            .from('poll_details')
            .select('*')
            .limit(50)
            .order("approval_score", {ascending: false})
    ).data as PollDetails[];

    return (
        <AdLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <SiteHeader/>
                <section
                    className="relative rounded-xl border border-emerald-600/30
                           bg-gradient-to-b from-emerald-900/30 via-zinc-900/30 to-zinc-900/20
                           px-4 py-3 shadow-[0_0_0_1px_rgba(16,185,129,0.08)_inset,0_6px_20px_rgba(16,185,129,0.06)]
                           backdrop-blur-sm">
                    <p className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-center justify-center">
                <span className="font-semibold text-zinc-100">
                     Community-powered <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-400">Classic+</span> vision — where players imagine and shape the World of Warcraft they truly want.
                </span>
                    </p>
                </section>
                {/* FILTERS*/}
                <section className="flex flex-wrap gap-2 items-center">
                    <input
                        className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 flex-1 placeholder:text-zinc-500"
                        placeholder="Search..."
                        value=""
                    />
                    {/*<FancySelect*/}
                    {/*    ariaLabel="Filter by category"*/}
                    {/*    widthClass="w-56"*/}
                    {/*    value={categoryId || ""}*/}
                    {/*    onChange={(val) => setCategoryId(val || undefined)}*/}
                    {/*    options={[*/}
                    {/*        {label: "All categories", value: ""},*/}
                    {/*        ...categories.map((c: any) => ({label: c.name, value: c.name})),*/}
                    {/*    ]}*/}
                    {/*/>*/}
                    {/*<FancySelect*/}
                    {/*    ariaLabel="Sort topics"*/}
                    {/*    widthClass="w-56"*/}
                    {/*    value=""*/}
                    {/*    onChange={(v) => {*/}
                    {/*    }}*/}
                    {/*    options={[*/}
                    {/*        {label: "Most approved ↓ (default)", value: "ratio:desc"},*/}
                    {/*        {label: "Least approved ↑", value: "ratio:asc"},*/}
                    {/*        {label: "Most popular ↓", value: "popularity:desc"},*/}
                    {/*        {label: "Least popular ↑", value: "popularity:asc"},*/}
                    {/*        {label: "Most upvotes ↓", value: "positive:desc"},*/}
                    {/*        {label: "Most downvotes ↓", value: "negative:desc"},*/}
                    {/*    ]}*/}
                    {/*/>*/}
                </section>
                {/* PAGINATION (top) */}
                {/*<PaginationBar*/}
                {/*    page={page}*/}
                {/*    totalPages={totalPages}*/}
                {/*    onPrev={() => setPage((p) => Math.max(1, p - 1))}*/}
                {/*    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}*/}
                {/*    pageSize={pageSize}*/}
                {/*    onPageSize={(ps) => {*/}
                {/*        setPageSize(ps);*/}
                {/*        setPage(1);*/}
                {/*    }}*/}
                {/*    loading={loading}*/}
                {/*/>*/}
                {/* TOPICS*/}
                <section className="max-h-[65vh] overflow-y-auto pr-1 fancy-scrollbar">
                    <ul className="grid gap-3">
                        {polls.map((t) => (
                            <PollCard
                                key={t.id}
                                pollDetails={t}
                                loggedIn={!!session}
                            />
                        ))}
                        {polls.length && (
                            <li className="text-zinc-400 text-sm">No topics found.</li>
                        )}
                    </ul>
                </section>
                {/* PAGINATION (bottom) */}
                {/*<PaginationBar*/}
                {/*    page={page}*/}
                {/*    totalPages={totalPages}*/}
                {/*    onPrev={() => setPage((p) => Math.max(1, p - 1))}*/}
                {/*    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}*/}
                {/*    pageSize={pageSize}*/}
                {/*    onPageSize={(ps) => {*/}
                {/*        setPageSize(ps);*/}
                {/*        setPage(1);*/}
                {/*    }}*/}
                {/*    loading={loading}*/}
                {/*/>*/}
            </main>
        </AdLayout>
    );
}

