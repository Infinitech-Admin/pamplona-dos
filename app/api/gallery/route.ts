import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Always read the disk on each request (never cache at build time),
// so newly added folders/images show up without editing code.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".jfif",
]);

// Optional: folders listed here appear first, in this order.
// Every other folder in /public/images is still included (A-Z after these).
const PRIORITY_FOLDERS: string[] = [];

// Folders under /public/images to ignore (e.g. logos, icons, banners)
const EXCLUDED_FOLDERS = new Set<string>([]);

const naturalSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export async function GET() {
  const imagesRoot = path.join(process.cwd(), "public", "images");

  try {
    // 1. Every sub-folder inside /public/images is an album
    const folders = fs
      .readdirSync(imagesRoot, { withFileTypes: true })
      .filter(
        (d) =>
          d.isDirectory() &&
          !d.name.startsWith(".") &&
          !EXCLUDED_FOLDERS.has(d.name),
      )
      .map((d) => d.name)
      .sort((a, b) => {
        const ia = PRIORITY_FOLDERS.indexOf(a);
        const ib = PRIORITY_FOLDERS.indexOf(b);
        if (ia !== -1 || ib !== -1) {
          return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
        }
        return naturalSort(a, b);
      });

    // 2. Collect the images of each album
    const albums = folders
      .map((folder) => {
        const folderPath = path.join(imagesRoot, folder);
        let files: string[] = [];
        try {
          files = fs
            .readdirSync(folderPath, { withFileTypes: true })
            .filter(
              (f) =>
                f.isFile() &&
                !f.name.startsWith(".") &&
                IMAGE_EXTENSIONS.has(path.extname(f.name).toLowerCase()),
            )
            .map((f) => f.name)
            .sort(naturalSort);
        } catch {
          files = [];
        }

        return {
          folder,
          // encode so names with spaces / special characters still load
          images: files.map(
            (f) =>
              `/images/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`,
          ),
        };
      })
      .filter((album) => album.images.length > 0);

    return NextResponse.json(
      { success: true, albums },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/gallery] Failed to read /public/images:", error);
    return NextResponse.json(
      { success: false, albums: [], message: "Could not read gallery folders" },
      { status: 500 },
    );
  }
}
