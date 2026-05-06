import type { MealPlan } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface MacroSummaryCardProps {
  plan: MealPlan;
}

const MACROS = [
  {
    key: "daily_calories" as const,
    label: "Calories",
    unit: "kcal",
    classes: "bg-primary/10 text-primary",
  },
  {
    key: "protein_g" as const,
    label: "Protein",
    unit: "g/day",
    classes: "bg-orange-50 text-orange-600",
  },
  {
    key: "carbs_g" as const,
    label: "Carbs",
    unit: "g/day",
    classes: "bg-blue-50 text-blue-600",
  },
  {
    key: "fat_g" as const,
    label: "Fat",
    unit: "g/day",
    classes: "bg-purple-50 text-purple-600",
  },
];

export default function MacroSummaryCard({ plan }: MacroSummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-lg mb-4 text-foreground">
          Daily Nutrition Targets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MACROS.map((m) => (
            <div key={m.label} className={`rounded-xl p-4 text-center ${m.classes.split(" ")[0]}`}>
              <p className={`text-3xl font-bold ${m.classes.split(" ")[1]}`}>
                {plan[m.key]}
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${m.classes.split(" ")[1]}`}>
                {m.unit}
              </p>
              <p className="text-xs mt-1 text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
