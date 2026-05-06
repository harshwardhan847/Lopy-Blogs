import { calcMET } from "@/lib/calculators";
import type { Activity } from "@/types";
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

interface BurnTableProps {
  activity: Activity;
}

const WEIGHTS = [50, 60, 70, 80, 90, 100];
const DURATIONS = [30, 60];

export default function BurnTable({ activity }: BurnTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-background">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Calories Burned by Weight & Duration
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead className="font-semibold text-foreground">
                Weight
              </TableHead>
              {DURATIONS.map((d) => (
                <TableHead
                  key={d}
                  className="text-right font-semibold text-foreground"
                >
                  {d} min
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {WEIGHTS.map((w, i) => (
              <TableRow
                key={w}
                className={cn(i % 2 === 0 ? "bg-surface" : "bg-background")}
              >
                <TableCell className="font-medium text-foreground">
                  {w} kg
                </TableCell>
                {DURATIONS.map((d) => (
                  <TableCell
                    key={d}
                    className="text-right font-semibold text-primary"
                  >
                    {calcMET(activity.met_value, w, d)} kcal
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
