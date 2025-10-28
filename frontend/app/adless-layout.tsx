export default function AdLessLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
                <div className="lg:block col-span-2 sticky top-4 flex items-center justify-center"></div>
                {children}
                <div className="lg:block col-span-2 sticky top-4 flex items-center justify-center"></div>
            </div>
        </>
    )
}