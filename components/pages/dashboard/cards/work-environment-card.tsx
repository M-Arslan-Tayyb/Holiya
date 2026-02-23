'use client'

import { useState } from "react"
import { Card } from '@/components/ui/card'
import { Loader2 } from "lucide-react"
import { CustomModal } from "@/components/custom/CustomModal"

interface Props {
    stressLevel?: {
        stress_level: number
        reason: string
        has_data: boolean
    }
    isLoading?: boolean
}

export function WorkEnvironmentCard({ stressLevel, isLoading }: Props) {

    const [open, setOpen] = useState(false)

    const percentage = stressLevel?.stress_level ?? 0
    const reason = stressLevel?.reason ?? ""
    const hasData = stressLevel?.has_data

    // 👉 Get first 3 words
    const previewText = reason
        ?.split(" ")
        .slice(0, 3)
        .join(" ")

    return (
        <>
            <Card
                className="border-none p-4 rounded-3xl gap-0
        bg-[linear-gradient(to_bottom,#FBE4D6_0%,#F7EFE5_60%,rgba(255,255,255,0.65)_100%)]"
            >
                {isLoading ? (
                    // 🔄 Loading State
                    <div className="flex items-center justify-center min-h-[180px]">
                        <Loader2 className="w-6 h-6 text-[#CA925F] animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="text-lg font-semibold text-text-gray font-sans">
                            Work environment
                        </div>

                        <p className="text-xs text-[#545454] opacity-70 mb-4">
                            Cervical Physical strain
                        </p>

                        {/* No Data State */}
                        {!hasData ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-[#545454] opacity-70">
                                    No data available yet
                                </p>
                                <p className="text-xs text-[#545454] opacity-50 mt-1">
                                    Complete your assessment to see insights
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Stress bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-base font-medium text-[#545454] opacity-90">
                                            Stress level
                                        </span>
                                        <span className="text-sm font-semibold text-[#545454] opacity-90">
                                            {percentage}%
                                        </span>
                                    </div>

                                    <div className="w-full bg-white/50 rounded-full h-2">
                                        <div
                                            className="bg-[#F6C6A4] h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between mt-2 text-xs text-[#545454] opacity-60">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>

                                {/* Info box */}
                                {reason && (
                                    <div
                                        className="bg-[linear-gradient(to_right,rgba(246,211,191,0.8),rgba(251,233,223,0.6))]
                            border border-[#F6C6A4] rounded-lg p-3 flex items-start gap-2"
                                    >
                                        <div className="w-5 h-5 rounded-full border-2 border-[#CA925F]
                              flex-shrink-0 mt-0.5 flex items-center justify-center">
                                            <span className="text-xs font-bold text-[#CA925F]">!</span>
                                        </div>

                                        <p className="text-sm text-[#545454]">
                                            <span className="font-medium">
                                                {previewText}...
                                            </span>{" "}
                                            <button
                                                onClick={() => setOpen(true)}
                                                className="text-[#CA925F] font-semibold ml-1 hover:underline"
                                            >
                                                View more
                                            </button>
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

            </Card>

            {/* Modal */}
            <CustomModal
                open={open}
                onOpenChange={setOpen}
                title="Stress Details"
            >
                {reason}
            </CustomModal>
        </>
    )
}