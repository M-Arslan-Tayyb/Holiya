import { Card } from '@/components/ui/card'

export function WorkEnvironmentCard() {
    return (
        <Card className="bg-white border border-[#F0E6D8] p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-[#545454] mb-1">Work environment</h3>
            <p className="text-sm text-[#545454] opacity-70 mb-6">Cervical Physical strain</p>

            {/* Stress level section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#545454]">Stress level</span>
                    <span className="text-sm font-semibold text-[#545454]">20%</span>
                </div>
                <div className="w-full bg-[#F7EFE5] rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-[#F6C6A4] to-[#CA925F] h-2 rounded-full"
                        style={{ width: '20%' }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#545454] opacity-60">
                    <span>Low</span>
                    <span>High</span>
                </div>
            </div>

            {/* Info box */}
            <div className="bg-[#FCE5D8] border border-[#F6C6A4] rounded-lg p-3 flex items-start gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#CA925F] flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#CA925F]">!</span>
                </div>
                <p className="text-sm text-[#545454]">
                    <span className="font-semibold">6 months</span> project ongoing
                </p>
            </div>
        </Card>
    )
}
