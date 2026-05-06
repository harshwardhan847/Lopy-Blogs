"use client";

import { useState } from "react";
import { calcMacros } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Goal = "weight_loss" | "muscle_gain" | "maintenance";

const GOAL_LABELS: Record<Goal, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
};

export default function MacroCalculator() {
  const [calories, setCalories] = useState(2000);
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [result, setResult] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  const calculate = () => {
    setResult(calcMacros(calories, goal));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-xl mb-5 text-foreground">
          Macro Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="macro-calories" className="mb-1">
              Daily Calories
            </Label>
            <Input
              id="macro-calories"
              type="number"
              value={calories}
              min={800}
              max={6000}
              step={50}
              onChange={(e) => setCalories(+e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block">Goal</Label>
            <div className="flex gap-2">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-medium border transition-colors",
                    goal === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={calculate} className="w-full">
          Calculate Macros
        </Button>

        {result && (
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="rounded-xl p-4 bg-primary/10">
                <p className="text-3xl font-bold text-primary">
                  {result.protein}g
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  Protein/day
                </p>
              </div>
              <div className="rounded-xl p-4 bg-blue-50">
                <p className="text-3xl font-bold text-blue-600">
                  {result.carbs}g
                </p>
                <p className="text-xs mt-1 text-muted-foreground">Carbs/day</p>
              </div>
              <div className="rounded-xl p-4 bg-purple-50">
                <p className="text-3xl font-bold text-purple-600">
                  {result.fat}g
                </p>
                <p className="text-xs mt-1 text-muted-foreground">Fat/day</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Based on {calories} kcal · {GOAL_LABELS[goal]} split
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
