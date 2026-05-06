"use client";

import { useState } from "react";
import { calcMET } from "@/lib/calculators";
import type { Activity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BurnCalculatorProps {
  activity: Activity;
}

export default function BurnCalculator({ activity }: BurnCalculatorProps) {
  const [weight, setWeight] = useState(70);
  const [duration, setDuration] = useState(30);

  const calories = calcMET(activity.met_value, weight, duration);

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-bold text-lg mb-5 text-foreground">
          Calorie Burn Calculator
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="burn-weight" className="mb-1.5 block">
              Body weight (kg)
            </Label>
            <Input
              id="burn-weight"
              type="number"
              min={30}
              max={250}
              value={weight}
              onChange={(e) => setWeight(Math.max(30, Number(e.target.value)))}
              className="text-center text-lg font-semibold"
            />
          </div>
          <div>
            <Label htmlFor="burn-duration" className="mb-1.5 block">
              Duration (minutes)
            </Label>
            <Input
              id="burn-duration"
              type="number"
              min={1}
              max={300}
              value={duration}
              onChange={(e) =>
                setDuration(Math.max(1, Number(e.target.value)))
              }
              className="text-center text-lg font-semibold"
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 text-center bg-primary/10">
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Estimated calories burned
          </p>
          <p className="text-5xl font-bold text-primary">{calories}</p>
          <p className="text-sm mt-1 text-muted-foreground">
            kcal &middot; {weight}kg &middot; {duration} min of {activity.name}
          </p>
        </div>

        <p className="text-xs mt-4 text-muted-foreground">
          Calculation uses MET value ({activity.met_value}) × body weight ×
          duration. Actual burn varies with fitness level, intensity, and
          individual metabolism.
        </p>
      </CardContent>
    </Card>
  );
}
