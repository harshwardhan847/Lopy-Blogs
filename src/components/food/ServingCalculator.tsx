"use client";

import { useState } from "react";
import type { Food } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ServingCalculatorProps {
  food: Food;
}

export default function ServingCalculator({ food }: ServingCalculatorProps) {
  const [grams, setGrams] = useState(100);

  const ratio = grams / 100;
  const calories = Math.round(food.calories_per_100g * ratio);
  const protein = +(food.protein * ratio).toFixed(1);
  const carbs = +(food.carbs * ratio).toFixed(1);
  const fat = +(food.fat * ratio).toFixed(1);

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-bold text-lg mb-4 text-foreground">
          Serving Calculator
        </h2>

        <Label htmlFor="serving-grams" className="mb-2 block">
          Serving size
        </Label>
        <div className="flex items-center gap-3 mb-6">
          <Input
            id="serving-grams"
            type="number"
            min={1}
            max={2000}
            value={grams}
            onChange={(e) => setGrams(Math.max(1, Number(e.target.value)))}
            className="w-28 text-center text-lg font-semibold"
          />
          <span className="text-sm font-medium text-muted-foreground">
            grams
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center bg-primary/10">
            <p className="text-2xl font-bold text-primary">{calories}</p>
            <p className="text-xs mt-0.5 text-muted-foreground">kcal</p>
          </div>
          <div className="rounded-xl p-3 text-center bg-orange-50">
            <p className="text-2xl font-bold text-orange-600">{protein}g</p>
            <p className="text-xs mt-0.5 text-muted-foreground">protein</p>
          </div>
          <div className="rounded-xl p-3 text-center bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{carbs}g</p>
            <p className="text-xs mt-0.5 text-muted-foreground">carbs</p>
          </div>
          <div className="rounded-xl p-3 text-center bg-purple-50">
            <p className="text-2xl font-bold text-purple-600">{fat}g</p>
            <p className="text-xs mt-0.5 text-muted-foreground">fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
