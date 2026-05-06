import Link from "next/link";
import type { Activity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface SimilarActivitiesProps {
  activities: Activity[];
}

export default function SimilarActivities({
  activities,
}: SimilarActivitiesProps) {
  if (activities.length === 0) return null;

  return (
    <section>
      <h2 className="font-bold text-xl mb-5 text-foreground">
        Similar Activities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <Link key={activity.slug} href={`/burn/${activity.slug}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {activity.name}
                    </p>
                    <p className="text-xs mt-0.5 text-muted-foreground">
                      {activity.category.replace(/-/g, " ")} &middot; MET{" "}
                      {activity.met_value}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-primary">
                      ~{Math.round(activity.met_value * 70 * 0.5)} kcal
                    </p>
                    <p className="text-xs text-muted-foreground">70kg / 30min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
