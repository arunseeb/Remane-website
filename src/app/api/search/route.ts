import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 100;

interface PageEntry {
  label: string;
  href: string;
}

// Cache the page list for the lifetime of the server process
let cachedPages: PageEntry[] | null = null;

function pathToLabel(routePath: string): string {
  const last = routePath.split("/").filter(Boolean).pop() ?? "";
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractLabel(filePath: string, routePath: string): string {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/title:\s*["']([^"']+)["']/);
    if (match) {
      let title = match[1].split(" — ")[0].trim();
      title = title.replace(/^Phase\s+[IVX]+:\s*/i, "").trim();
      return title;
    }
  } catch {
    // fall through
  }
  return pathToLabel(routePath);
}

function scanPages(dir: string, routeBase = ""): PageEntry[] {
  const results: PageEntry[] = [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (
      entry.name.startsWith(".") ||
      entry.name.startsWith("_") ||
      entry.name.startsWith("(") ||
      entry.name === "api" ||
      entry.name === "node_modules"
    )
      continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...scanPages(fullPath, `${routeBase}/${entry.name}`));
    } else if (/^page\.(tsx?|jsx?)$/.test(entry.name)) {
      if (!routeBase) continue;
      results.push({
        label: extractLabel(fullPath, routeBase),
        href: routeBase,
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") ?? "";

  // Reject oversized queries
  if (raw.length > MAX_QUERY_LENGTH) {
    return NextResponse.json([], { status: 400 });
  }

  const q = raw.toLowerCase().trim();

  if (!q) return NextResponse.json([]);

  if (!cachedPages) {
    cachedPages = scanPages(path.join(process.cwd(), "src", "app"));
  }

  const filtered = cachedPages.filter((p) =>
    p.label.toLowerCase().split(/\s+/).some((word) => word.startsWith(q))
  );

  return NextResponse.json(filtered);
}
