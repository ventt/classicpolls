"use client";

export default function ReportButton({ topicId }: { topicId: string }) {
    async function handleReport() {
        const reason = prompt("Please describe briefly why you are reporting this topic:");
        if (!reason) return;

        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, reason }),
            });

            if (res.ok) {
                alert("✅ Report submitted — thank you for helping keep the community clean!");
            } else {
                const data = await res.json().catch(() => ({}));
                alert(`❌ Failed to submit report: ${data?.error ?? "Unknown error"}`);
            }
        } catch (err) {
            console.error(err);
            alert("❌ Something went wrong while sending your report.");
        }
    }

    return (
        <button
            onClick={handleReport}
            className="px-3 py-1 rounded-lg border border-red-700/50 bg-red-900/20
                 text-red-300 text-sm hover:bg-red-800/40 active:scale-95
                 transition shadow-sm"
            title="Report this topic"
        >
            Report
        </button>
    );
}
