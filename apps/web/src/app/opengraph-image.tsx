import { ImageResponse } from "next/og";

import { HAUSCRAWL_LOGO_DATA_URI, HAUSCRAWL_MARK_DATA_URI } from "./brand-logo-data";

export const alt = "HausCrawl — Swipe through homes. Decide together.";
export const size = { width: 1_200, height: 630 };
export const contentType = "image/png";

const homes = [
  { name: "Silver Lake · Los Angeles", facts: "Light-filled · Garden", result: "Sample" },
  { name: "Logan Square · Chicago", facts: "Walkable · Bright", result: "Sample" },
  { name: "East Austin · Austin", facts: "Wood details · Cozy", result: "Sample" },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#232A4A",
        color: "#FFFFFF",
        padding: "48px 64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img
          src={HAUSCRAWL_LOGO_DATA_URI}
          width={210}
          height={70}
          alt="HausCrawl"
          style={{ display: "block" }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 17,
            letterSpacing: "0",
            color: "#EEF1F4",
          }}
        >
          Nationwide early access
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 52,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.055em",
            }}
          >
            Swipe through homes.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: "-0.055em",
            }}
          >
            Decide together.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 26, color: "#EEF1F4" }}>
            Save what you love. Join the nationwide waitlist.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 292,
            height: 430,
            backgroundColor: "#1F7A74",
            borderRadius: 42,
            padding: 7,
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
              borderRadius: 36,
              padding: 18,
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "#6E736D",
                  }}
                >
                  Shared shortlist
                </div>
                <div style={{ display: "flex", marginTop: 5, fontSize: 23, fontWeight: 500 }}>
                  Our first home
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <div
                  style={{
                    display: "flex",
                    width: 27,
                    height: 27,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    backgroundColor: "#F5F4EF",
                    fontSize: 11,
                  }}
                >
                  Y
                </div>
                <div
                  style={{
                    display: "flex",
                    width: 27,
                    height: 27,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    backgroundColor: "#F5F4EF",
                    fontSize: 11,
                  }}
                >
                  P
                </div>
              </div>
            </div>

            <div style={{ display: "flex", marginTop: 10, fontSize: 12, color: "#4B5364" }}>
              Sample shared shortlist
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 12 }}>
              {homes.map((home) => (
                <div
                  key={home.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid #E5E2DA",
                    borderRadius: 13,
                    padding: 9,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 46,
                      height: 46,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 9,
                      backgroundColor: "#EEF1F4",
                    }}
                  >
                    <img
                      src={HAUSCRAWL_MARK_DATA_URI}
                      width={30}
                      height={30}
                      alt=""
                      style={{ display: "block" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", fontSize: 14, fontWeight: 600 }}>
                      {home.name}
                    </div>
                    <div style={{ display: "flex", fontSize: 9, color: "#4B5364" }}>
                      {home.facts}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignSelf: "flex-start",
                        marginTop: 2,
                        border: "1px solid #D3CFC4",
                        borderRadius: 12,
                        padding: "3px 7px",
                        fontSize: 8,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#1F2422",
                      }}
                    >
                      {home.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #D8D6CE",
          paddingTop: 20,
          fontSize: 17,
          color: "#6F7069",
        }}
      >
        <div style={{ display: "flex" }}>Early access · waitlist open</div>
        <div style={{ display: "flex" }}>No street addresses</div>
      </div>
    </div>,
    { ...size },
  );
}
