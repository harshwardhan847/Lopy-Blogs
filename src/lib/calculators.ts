/** Calories burned: MET × weight (kg) × duration (hours) */
export function calcMET(
  met: number,
  weightKg: number,
  durationMin: number,
): number {
  return Math.round(met * weightKg * (durationMin / 60));
}

/** BMR via Mifflin-St Jeor */
export function calcBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: "male" | "female",
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** TDEE = BMR × activity multiplier */
export function calcTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier);
}

/** Macro targets based on goal */
export function calcMacros(
  calories: number,
  goal: "weight_loss" | "muscle_gain" | "maintenance",
): { protein: number; carbs: number; fat: number } {
  if (goal === "weight_loss") {
    return {
      protein: Math.round((calories * 0.35) / 4),
      carbs: Math.round((calories * 0.35) / 4),
      fat: Math.round((calories * 0.3) / 9),
    };
  }
  if (goal === "muscle_gain") {
    return {
      protein: Math.round((calories * 0.3) / 4),
      carbs: Math.round((calories * 0.45) / 4),
      fat: Math.round((calories * 0.25) / 9),
    };
  }
  // maintenance
  return {
    protein: Math.round((calories * 0.25) / 4),
    carbs: Math.round((calories * 0.5) / 4),
    fat: Math.round((calories * 0.25) / 9),
  };
}

/** Ideal body weight (Devine formula) in kg */
export function calcIdealWeight(
  heightCm: number,
  sex: "male" | "female",
): number {
  const inchesOver5Feet = Math.max(0, heightCm / 2.54 - 60);
  const base = sex === "male" ? 50 : 45.5;
  return Math.round((base + 2.3 * inchesOver5Feet) * 10) / 10;
}

/** BMI */
export function calcBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
