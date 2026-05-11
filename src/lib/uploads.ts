import path from "path";
import os from "os";

// Persistent upload directory — lives outside the project so it survives
// fresh git checkouts on every deploy. Override with UPLOADS_DIR env var.
export function getUploadsDir(): string {
  return process.env.UPLOADS_DIR ?? path.join(os.homedir(), "uploads");
}
