"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ShoppingListProps {
  items: string[];
}

export default function ShoppingList({ items }: ShoppingListProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-foreground">Shopping List</h2>
          <Badge variant="secondary">
            {checked.size}/{items.length} done
          </Badge>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <Checkbox
                id={`item-${i}`}
                checked={checked.has(i)}
                onCheckedChange={() => toggle(i)}
              />
              <label
                htmlFor={`item-${i}`}
                className={cn(
                  "text-sm cursor-pointer",
                  checked.has(i)
                    ? "line-through text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {item}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
