'use client'
export default function PageHeader({ title }: { title: string }) {
    return (
        <div className="bg-[#EBF1F4] py-16 pt-32">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">{title}</h1>
            </div>
        </div>
    )
}