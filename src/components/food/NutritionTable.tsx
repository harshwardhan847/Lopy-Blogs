import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Food } from "@/types";

interface NutritionTableProps {
  food: Food;
  servingGrams?: number;
}

export default function NutritionTable({
  food,
  servingGrams = 100,
}: NutritionTableProps) {
  const ratio = servingGrams / 100;

  const rows = [
    {
      label: "Calories",
      value: Math.round(food.calories_per_100g * ratio),
      unit: "kcal",
      highlight: true,
    },
    { label: "Protein", value: +(food.protein * ratio).toFixed(1), unit: "g" },
    {
      label: "Carbohydrates",
      value: +(food.carbs * ratio).toFixed(1),
      unit: "g",
    },
    { label: "Fat", value: +(food.fat * ratio).toFixed(1), unit: "g" },
    ...(food.fibre != null
      ? [{ label: "Fibre", value: +(food.fibre * ratio).toFixed(1), unit: "g" }]
      : []),
    ...(food.sugar != null
      ? [{ label: "Sugar", value: +(food.sugar * ratio).toFixed(1), unit: "g" }]
      : []),
    ...(food.sodium != null
      ? [
          {
            label: "Sodium",
            value: Math.round(food.sodium * ratio),
            unit: "mg",
          },
        ]
      : []),
  ];

  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-background">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nutrition Facts — per {servingGrams}g serving
        </p>
      </div>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              className={cn(row.highlight && "bg-primary/10")}
            >
              <TableCell className="font-medium text-foreground">
                {row.label}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "font-semibold",
                    row.highlight ? "text-primary" : "text-foreground",
                  )}
                >
                  {row.value}
                </span>{" "}
                <span className="font-normal text-xs text-muted-foreground">
                  {row.unit}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
