import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Oatmeal – Free Calorie Tracker App",
  description:
    "Oatmeal is a free calorie tracker and nutrition database app built to make healthy eating simple, data-driven, and enjoyable.",
  alternates: { canonical: "https://oatmealapp.com/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
        About Oatmeal
      </h1>
      <p className="text-sm mb-10 text-muted-foreground">
        Building a calorie tracker that people actually enjoy using.
      </p>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            What Is Oatmeal?
          </h2>
          <p className="text-muted-foreground">
            Oatmeal is a free calorie tracker app designed to remove the
            friction from healthy eating. Whether you want to lose weight, build
            muscle, or simply understand what you are eating, Oatmeal gives you
            the data you need without the complexity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            What This Website Offers
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              <strong>Food Calorie Database</strong> — detailed nutrition facts
              for 80+ foods including protein, carbs, fat, fibre, and sodium.
            </li>
            <li>
              <strong>Calories Burned Calculator</strong> — MET-based burn
              estimates for 20+ activities at any weight and duration.
            </li>
            <li>
              <strong>Meal Plans</strong> — structured 7-day plans for weight
              loss, muscle gain, and maintenance with shopping lists.
            </li>
            <li>
              <strong>Health Calculators</strong> — free TDEE, BMR, macro, and
              BMI calculators with instant results.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Our Approach
          </h2>
          <p className="text-muted-foreground">
            All nutrition data on this site is sourced from established
            databases and reviewed for accuracy. Calculators use peer-validated
            formulas (Mifflin-St Jeor for BMR, MET values from the Compendium of
            Physical Activities). We aim to be a reliable, ad-light resource for
            anyone working on their health.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Download the App
          </h2>
          <p className="text-muted-foreground">
            Oatmeal is available free on the App Store. Log meals, scan
            barcodes, set calorie goals, and track macros — all in one clean,
            fast app.
          </p>
          <a
            href="https://apps.apple.com/app/oatmeal"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "mt-4")}
          >
            Download Free on iOS
          </a>
        </section>
      </div>
    </main>
  );
}
