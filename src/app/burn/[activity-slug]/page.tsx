import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllActivities,
  getActivityBySlug,
  getSimilarActivities,
} from "@/lib/activities";
import { buildActivityMetadata } from "@/lib/seo";
import BreadcrumbSchema from "@/components/shared/BreadcrumbSchema";
import FAQSchema from "@/components/shared/FAQSchema";
import BurnCalculator from "@/components/activity/BurnCalculator";
import BurnTable from "@/components/activity/BurnTable";
import SimilarActivities from "@/components/activity/SimilarActivities";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { calcMET } from "@/lib/calculators";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ "activity-slug": string }>;
}

export async function generateStaticParams() {
  const activities = await getAllActivities();
  return activities.map((a) => ({ "activity-slug": a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { "activity-slug": slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) return { title: "Activity Not Found" };
  return buildActivityMetadata(activity);
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { "activity-slug": slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) notFound();

  const similarActivities = getSimilarActivities(activity, 4);

  const burn60kg30 = calcMET(activity.met_value, 60, 30);
  const burn70kg30 = calcMET(activity.met_value, 70, 30);
  const burn80kg30 = calcMET(activity.met_value, 80, 30);
  const burn70kg60 = calcMET(activity.met_value, 70, 60);

  const faqs = [
    {
      question: `How many calories does ${activity.name} burn?`,
      answer: `${activity.name} burns approximately ${burn70kg30} calories in 30 minutes for a 70kg person, and ${burn70kg60} calories in 60 minutes. The exact amount depends on your body weight, intensity, and fitness level.`,
    },
    {
      question: `How many calories does a 60kg person burn doing ${activity.name} for 30 minutes?`,
      answer: `A 60kg person burns approximately ${burn60kg30} calories in 30 minutes of ${activity.name}.`,
    },
    {
      question: `How many calories does an 80kg person burn doing ${activity.name} for 30 minutes?`,
      answer: `An 80kg person burns approximately ${burn80kg30} calories in 30 minutes of ${activity.name}.`,
    },
    {
      question: `What is the MET value for ${activity.name}?`,
      answer: `${activity.name} has a MET (Metabolic Equivalent of Task) value of ${activity.met_value}. The formula for calories burned is: MET × body weight (kg) × duration (hours).`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Activity Burn", href: "/burn" },
          { name: activity.name, href: `/burn/${activity.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />

      {/* Hero */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs mb-4 flex gap-1 flex-wrap text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/burn" className="hover:text-primary">
              Activity Burn
            </Link>
            <span>/</span>
            <span>{activity.name}</span>
          </nav>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="mb-2">
                {activity.category.replace(/-/g, " ")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                Calories Burned {activity.name}
              </h1>
              <p className="text-base text-muted-foreground">
                {activity.description}
              </p>
            </div>
            <div className="shrink-0 px-6 py-4 rounded-2xl text-center bg-primary text-primary-foreground min-w-[140px]">
              <p className="text-4xl font-bold">{burn70kg30}</p>
              <p className="text-sm mt-1 opacity-90">kcal / 30 min</p>
              <p className="text-xs opacity-75">at 70 kg</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-8">
            <BurnCalculator activity={activity} />
            <BurnTable activity={activity} />

            {/* Activity stats */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4 text-foreground">
                  Burn Rate at Common Weights
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { kg: 60, burn: burn60kg30 },
                    { kg: 70, burn: burn70kg30 },
                    { kg: 80, burn: burn80kg30 },
                  ].map((stat) => (
                    <div key={stat.kg} className="rounded-xl p-4 bg-primary/10">
                      <p className="text-2xl font-bold text-primary">
                        {stat.burn}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">kcal</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.kg}kg / 30 min
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <InContentAd type="custom" />

            {/* FAQ */}
            <section>
              <h2 className="font-bold text-xl mb-5 text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2 text-foreground">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <SimilarActivities activities={similarActivities} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <SidebarAd type="custom" />

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Track {activity.name} in Oatmeal
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Log workouts and meals in one place. Free calorie & activity
                  tracker for iOS.
                </p>
                <a
                  href="https://apps.apple.com/app/oatmeal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "w-full text-sm")}
                >
                  Download Free
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-semibold mb-1 text-foreground">
                  MET Value
                </p>
                <p className="text-3xl font-bold mb-1 text-primary">
                  {activity.met_value}
                </p>
                <p className="text-xs text-muted-foreground">
                  Metabolic Equivalent of Task
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-base mb-3 text-foreground">
                  Related Tools
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/calculators/tdee-calculator"
                      className="text-primary hover:underline"
                    >
                      TDEE Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/bmr-calculator"
                      className="text-primary hover:underline"
                    >
                      BMR Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/macro-calculator"
                      className="text-primary hover:underline"
                    >
                      Macro Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calories"
                      className="text-primary hover:underline"
                    >
                      Calorie Database
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <SidebarAd type="none" />
          </aside>
        </div>
      </div>
    </>
  );
}
