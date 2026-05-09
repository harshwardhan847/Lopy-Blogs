const APP_URL = "https://oatmeal.lopy.in";

export function AppCTABlock() {
  return (
    <div className="my-10 rounded-2xl bg-orange-600 p-8 text-white flex flex-col sm:flex-row items-center gap-6">
      <div className="text-4xl flex-shrink-0">🥣</div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold mb-2">
          Track Every Calorie with Oatmeal
        </h3>
        <p className="text-orange-100 text-sm mb-4 leading-relaxed">
          Put everything you learned into practice. Oatmeal makes it effortless
          to log meals, track macros, and stay on top of your daily goals — all
          from your phone.
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-orange-50 transition-colors"
        >
          Download Oatmeal Free →
        </a>
      </div>
    </div>
  );
}
