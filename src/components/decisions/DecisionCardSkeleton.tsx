import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardContent } from "@/components/ui/Card"

export function DecisionCardSkeleton() {
    return (
        <Card className="overflow-hidden border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <div className="flex justify-between items-end pt-2">
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-md" />
                </div>
            </CardContent>
        </Card>
    )
}
