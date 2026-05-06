"use client";

import { useState } from "react";
import { calcBMR, calcTDEE } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  active: "Very active (6-7 days/week)",
  very_active: "Extra active (physical job + exercise)",
};

export default function TDEECalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("moderate");
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(
    null,
  );

  const calculate = () => {
    const bmr = calcBMR(weight, height, age, sex);
    const tdee = calcTDEE(bmr, activity);
    setResult({ bmr, tdee });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-xl mb-5 text-foreground">
          TDEE Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="tdee-weight" className="mb-1">
              Weight (kg)
            </Label>
            <Input
              id="tdee-weight"
              type="number"
              value={weight}
              min={30}
              max={250}
              onChange={(e) => setWeight(+e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tdee-height" className="mb-1">
              Height (cm)
            </Label>
            <Input
              id="tdee-height"
              type="number"
              value={height}
              min={100}
              max={250}
              onChange={(e) => setHeight(+e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tdee-age" className="mb-1">
              Age
            </Label>
            <Input
              id="tdee-age"
              type="number"
              value={age}
              min={10}
              max={100}
              onChange={(e) => setAge(+e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block">Sex</Label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize",
                    sex === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-5">
          <Label className="mb-1 block">Activity Level</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={calculate} className="w-full">
          Calculate TDEE
        </Button>

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5 text-center bg-primary/10">
              <p className="text-3xl font-bold text-primary">{result.bmr}</p>
              <p className="text-sm mt-1 text-muted-foreground">BMR (kcal/day)</p>
            </div>
            <div className="rounded-xl p-5 text-center bg-primary text-primary-foreground">
              <p className="text-3xl font-bold">{result.tdee}</p>
              <p className="text-sm mt-1 opacity-90">TDEE (kcal/day)</p>
            </div>
            <div className="col-span-2 rounded-xl p-4 text-sm bg-primary/10 text-foreground">
              <strong className="text-primary">Tip:</strong> To lose weight,
              eat {result.tdee - 500}–{result.tdee - 300} kcal/day (500–300
              deficit). To gain muscle, eat {result.tdee + 200}–
              {result.tdee + 400} kcal/day.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
