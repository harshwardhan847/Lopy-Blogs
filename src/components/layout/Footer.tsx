import Link from "next/link";

const FOOTER_LINKS = {
  Blog: [
    { href: "/blog", label: "All Articles" },
    { href: "/blog", label: "Nutrition Tips" },
    { href: "/blog", label: "Weight Loss" },
    { href: "/blog", label: "Fitness Guides" },
  ],
  "Food Database": [
    { href: "/calories", label: "Browse Foods" },
    { href: "/calories/rice-cooked", label: "Rice Calories" },
    { href: "/calories/chicken-breast", label: "Chicken Calories" },
    { href: "/calories/whole-milk", label: "Milk Calories" },
  ],
  "Calorie Burn": [
    { href: "/burn", label: "All Activities" },
    { href: "/burn/running", label: "Running" },
    { href: "/burn/cycling", label: "Cycling" },
    { href: "/burn/yoga", label: "Yoga" },
  ],
  "Meal Plans": [
    { href: "/meal-plans", label: "All Meal Plans" },
    { href: "/meal-plans/keto-indian-weight-loss", label: "Keto Indian Plan" },
    { href: "/meal-plans/high-protein-indian", label: "High Protein Plan" },
    {
      href: "/meal-plans/mediterranean-heart-health",
      label: "Mediterranean Plan",
    },
  ],
  Calculators: [
    { href: "/calculators/tdee-calculator", label: "TDEE Calculator" },
    { href: "/calculators/bmr-calculator", label: "BMR Calculator" },
    { href: "/calculators/macro-calculator", label: "Macro Calculator" },
    { href: "/calculators/bmi-calculator", label: "BMI Calculator" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-foreground"
          >
            Oatmeal
          </Link>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Oatmeal App. All rights reserved.
          </p>
          <nav className="flex gap-4 text-xs text-muted-foreground">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
