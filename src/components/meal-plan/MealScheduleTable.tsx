import type { DayMeals, Meal } from "@/types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface MealScheduleTableProps {
  meals: DayMeals[];
}

function MealCell({ meal }: { meal: Meal }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{meal.name}</p>
      <p className="text-xs mt-0.5 text-primary">{meal.calories} kcal</p>
      {(meal.protein || meal.carbs || meal.fat) && (
        <p className="text-xs mt-0.5 text-muted-foreground">
          {meal.protein ? `P ${meal.protein}g` : ""}
          {meal.carbs ? ` · C ${meal.carbs}g` : ""}
          {meal.fat ? ` · F ${meal.fat}g` : ""}
        </p>
      )}
    </div>
  );
}

export default function MealScheduleTable({ meals }: MealScheduleTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-bold text-lg text-foreground">
          Weekly Meal Schedule
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="bg-background">
              {["Day", "Breakfast", "Lunch", "Dinner", "Snack"].map((h) => (
                <TableHead key={h} className="font-semibold text-foreground">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.map((day, i) => (
              <TableRow
                key={day.day}
                className={cn(i % 2 === 0 ? "bg-surface" : "bg-background")}
              >
                <TableCell className="font-semibold align-top text-foreground">
                  {day.day}
                </TableCell>
                <TableCell className="align-top">
                  <MealCell meal={day.breakfast} />
                </TableCell>
                <TableCell className="align-top">
                  <MealCell meal={day.lunch} />
                </TableCell>
                <TableCell className="align-top">
                  <MealCell meal={day.dinner} />
                </TableCell>
                <TableCell className="align-top">
                  {day.snack ? (
                    <MealCell meal={day.snack} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
