import { ImageResponse } from "next/og";

export const alt = "Oatmeal calorie tracker nutrition tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fff7ed",
          color: "#18181b",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: "22px",
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "#f97316",
                borderRadius: "28px",
                color: "white",
                display: "flex",
                fontSize: "54px",
                height: "104px",
                justifyContent: "center",
                width: "104px",
              }}
            >
              O
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "46px", fontWeight: 800 }}>Oatmeal</div>
              <div style={{ color: "#9a3412", fontSize: "28px" }}>
                Calorie Tracker
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 900,
              letterSpacing: "0",
              lineHeight: 1,
              maxWidth: "950px",
            }}
          >
            Nutrition facts, calorie burn, meal plans, and health calculators.
          </div>
          <div
            style={{
              color: "#57534e",
              display: "flex",
              fontSize: "30px",
            }}
          >
            Free tools to plan, track, and understand your nutrition.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

