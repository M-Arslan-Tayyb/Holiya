import { Card } from '@/components/ui/card'

export function IntegratedAppsCard() {
    return (
        <Card className="bg-white border border-[#F0E6D8] p-6 rounded-2xl">
            <p className="text-sm text-[#545454] opacity-70 mb-4">Integrated App</p>
            <p className="text-sm text-[#545454] opacity-70 mb-6">Wearable Device</p>

            {/* Apps grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Flo App */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-[#E91E63] to-[#C2185B]">
                    <div className="text-4xl mb-2">💗</div>
                    <p className="text-xs font-medium text-white text-center">Flo</p>
                </div>

                {/* Tens Unit */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-[#D4A574] to-[#B8956A]">
                    <div className="text-4xl mb-2">⌚</div>
                    <p className="text-xs font-medium text-white text-center">Tens Unit</p>
                </div>
            </div>
        </Card>
    )
}
