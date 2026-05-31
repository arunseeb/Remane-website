import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface PageEntry {
  label: string;
  href: string;
}

function pathToLabel(routePath: string): string {
  const last = routePath.split("/").filter(Boolean).pop() ?? "";
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Reads the page file and extracts the metadata title, falling back to the route slug.
function extractLabel(filePath: string, routePath: string): string {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/title:\s*["']([^"']+)["']/);
    if (match) {
      // Drop the " — Remane" suffix and any "Phase X: " prefix
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
    // Skip Next.js internals, hidden files, route groups, and the API folder
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
      if (!routeBase) continue; // skip the home page
      results.push({
        label: extractLabel(fullPath, routeBase),
        href: routeBase,
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase().trim();
  const appDir = path.join(process.cwd(), "src", "app");
  const pages = scanPages(appDir);

  // Prefix-match on the label; return nothing when query is empty
  const filtered = q
    ? pages.filter((p) => p.label.toLowerCase().startsWith(q))
    : [];

  return NextResponse.json(filtered);
}
