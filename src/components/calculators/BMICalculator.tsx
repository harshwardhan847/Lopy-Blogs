"use client";

import { useState } from "react";
import { calcBMI, bmiCategory } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const BMI_CATEGORY_STYLES: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  Underweight: {
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-400",
  },
  "Normal weight": {
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary",
  },
  Overweight: {
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-400",
  },
  Obese: {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-400",
  },
};

export default function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
  } | null>(null);

  const calculate = () => {
    const bmi = calcBMI(weight, height);
    setResult({ bmi, category: bmiCategory(bmi) });
  };

  const styles = result ? BMI_CATEGORY_STYLES[result.category] : null;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-bold text-xl mb-5 text-foreground">
          BMI Calculator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <Label htmlFor="bmi-weight" className="mb-1">
              Weight (kg)
            </Label>
            <Input
              id="bmi-weight"
              type="number"
              value={weight}
              min={30}
              max={250}
              onChange={(e) => setWeight(+e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bmi-height" className="mb-1">
              Height (cm)
            </Label>
            <Input
              id="bmi-height"
              type="number"
              value={height}
              min={100}
              max={250}
              onChange={(e) => setHeight(+e.target.value)}
            />
          </div>
        </div>
        <Button onClick={calculate} className="w-full">
          Calculate BMI
        </Button>

        {result && styles && (
          <div className="mt-6 space-y-4">
            <div
              className={cn(
                "rounded-xl p-5 text-center border-l-4",
                styles.bg,
                styles.border,
              )}
            >
              <p className={cn("text-5xl font-bold", styles.text)}>
                {result.bmi}
              </p>
              <p className={cn("text-lg font-semibold mt-1", styles.text)}>
                {result.category}
              </p>
            </div>
            <div className="rounded-xl p-4 text-xs bg-muted/40">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="font-bold text-blue-600">{"< 18.5"}</p>
                  <p className="text-muted-foreground">Underweight</p>
                </div>
                <div>
                  <p className="font-bold text-primary">18.5–24.9</p>
                  <p className="text-muted-foreground">Normal</p>
                </div>
                <div>
                  <p className="font-bold text-amber-600">25–29.9</p>
                  <p className="text-muted-foreground">Overweight</p>
                </div>
                <div>
                  <p className="font-bold text-red-600">{"≥ 30"}</p>
                  <p className="text-muted-foreground">Obese</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
