'use client'

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function UserListingPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#CA925F]" />
                <h1 className="text-3xl font-bold text-[#545454]">User Management</h1>
            </div>
            
            <Card className="p-8 bg-white/70 backdrop-blur-md border-none shadow-xl rounded-2xl">
                <h2 className="text-xl font-semibold text-[#755134] mb-4">Users List</h2>
                <p className="text-[#545454]">
                    Manage and view all registered users of the Holiya platform.
                </p>
                <div className="mt-6 p-4 bg-[#FAE5D6] rounded-xl text-center text-[#755134] italic">
                    User listing table implementation coming soon...
                </div>
            </Card>
        </div>
    )
}
