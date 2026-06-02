import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const logoBuffer = fs.readFileSync(
    path.join(process.cwd(), "public", "brand", "logo-red.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f5",
          borderRadius: "50%",
        }}
      >
        <img
          src={logoSrc}
          style={{ width: "68%", height: "68%", objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
