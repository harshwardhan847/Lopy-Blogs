import Link from "next/link";
import type { Food } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface SimilarFoodsProps {
  foods: Food[];
}

export default function SimilarFoods({ foods }: SimilarFoodsProps) {
  if (foods.length === 0) return null;

  return (
    <section>
      <h2 className="font-bold text-xl mb-4 text-foreground">Similar Foods</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {foods.map((food) => (
          <Link key={food.slug} href={`/calories/${food.slug}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4">
                <p className="font-semibold text-sm truncate text-foreground">
                  {food.name}
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  {food.calories_per_100g} kcal / 100g
                </p>
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                  <span>P {food.protein}g</span>
                  <span>C {food.carbs}g</span>
                  <span>F {food.fat}g</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
