"use client";

import { useState } from "react";
import { calcBMR } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function BMRCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(calcBMR(weight, height, age, sex));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-xl mb-5 text-foreground">
          BMR Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="bmr-weight" className="mb-1">
              Weight (kg)
            </Label>
            <Input
              id="bmr-weight"
              type="number"
              value={weight}
              min={30}
              max={250}
              onChange={(e) => setWeight(+e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bmr-height" className="mb-1">
              Height (cm)
            </Label>
            <Input
              id="bmr-height"
              type="number"
              value={height}
              min={100}
              max={250}
              onChange={(e) => setHeight(+e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bmr-age" className="mb-1">
              Age
            </Label>
            <Input
              id="bmr-age"
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
        <Button onClick={calculate} className="w-full">
          Calculate BMR
        </Button>

        {result !== null && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl p-5 text-center bg-primary text-primary-foreground">
              <p className="text-4xl font-bold">{result}</p>
              <p className="text-sm mt-1 opacity-90">calories/day (BMR)</p>
            </div>
            <p className="text-sm rounded-xl p-4 bg-primary/10 text-foreground">
              Your BMR is the number of calories your body burns at complete
              rest. This is calculated using the{" "}
              <strong>Mifflin-St Jeor equation</strong>, which is the most
              accurate formula for most people.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
