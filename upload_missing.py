#!/usr/bin/env python3
"""Upload missing .m4a pronunciation files to R2 english-orbit bucket."""

import os
import subprocess
import json
import sys

ACCOUNT_ID = "2497517a9aa6fae07a043ac4a24bfdd2"
BUCKET = "english-orbit"
API_BASE = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects"

TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")
if not TOKEN:
    # Try to read from .env.local
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("CLOUDFLARE_API_TOKEN="):
                    TOKEN = line.strip().split("=", 1)[1]
                    break

if not TOKEN:
    print("ERROR: CLOUDFLARE_API_TOKEN not found")
    sys.exit(1)

def r2_list(prefix):
    """List all objects with given prefix on R2, handling pagination."""
    objects = set()
    cursor = None
    url = f"{API_BASE}?per_page=1000&prefix={prefix}"

    while True:
        u = url
        if cursor:
            u = f"{url}&cursor={cursor}"
        try:
            result = subprocess.run(
                ["curl", "-s", "-H", f"Authorization: Bearer {TOKEN}", u],
                capture_output=True, text=True, timeout=30
            )
            data = json.loads(result.stdout)
            if not data.get("success"):
                print(f"API error: {data.get('errors')}")
                break

            for obj in data.get("result", []):
                key = obj["key"]
                if key.endswith(".m4a"):
                    # Strip prefix to get just the filename
                    fname = key.replace(prefix, "")
                    objects.add(fname)

            truncated = data.get("result_info", {}).get("is_truncated", False)
            if not truncated:
                break

            cursor = data.get("result_info", {}).get("cursor")
            if not cursor:
                break
        except Exception as e:
            print(f"Error listing R2: {e}")
            break

    return objects

def get_local_files(subdir):
    """Get set of local .m4a filenames from tmp/<subdir>/."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tmp", subdir)
    files = set()
    if os.path.exists(path):
        for f in os.listdir(path):
            if f.endswith(".m4a"):
                files.add(f)
    return files

def upload_file(local_path, r2_key):
    """Upload a single file to R2 via S3-compatible multipart upload through the CF API."""
    # Use the R2 direct upload URL pattern
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{r2_key}"

    result = subprocess.run(
        ["curl", "-s", "-X", "PUT",
         "-H", f"Authorization: Bearer {TOKEN}",
         "--data-binary", f"@{local_path}",
         "-H", "Content-Type: audio/mp4",
         url],
        capture_output=True, text=True, timeout=60
    )

    if result.returncode == 0:
        try:
            data = json.loads(result.stdout)
            if data.get("success"):
                return True, None
            else:
                return False, str(data.get("errors"))
        except json.JSONDecodeError:
            return False, result.stdout[:200]
    return False, result.stderr[:200]

def main():
    for accent in ["uk", "us"]:
        r2_prefix = f"pronunciations/{accent}/"
        local_subdir = accent

        print(f"\n{'='*60}")
        print(f"Processing {accent.upper()} pronunciations")
        print(f"{'='*60}")

        print("Listing R2 objects (may take a while with pagination)...")
        r2_files = r2_list(r2_prefix)
        print(f"  Found {len(r2_files)} files on R2")

        local_files = get_local_files(local_subdir)
        print(f"  Found {len(local_files)} local files")

        missing = local_files - r2_files
        print(f"  Missing: {len(missing)} files need uploading")

        if not missing:
            print("  All files already uploaded!")
            continue

        # Save missing list for reference
        missing_path = f"/tmp/r2_missing_{accent}.txt"
        with open(missing_path, "w") as f:
            for name in sorted(missing):
                f.write(name + "\n")
        print(f"  Missing list saved to {missing_path}")

        # Upload
        success_count = 0
        fail_count = 0
        total = len(missing)

        for i, fname in enumerate(sorted(missing)):
            local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tmp", local_subdir, fname)
            r2_key = f"pronunciations/{accent}/{fname}"

            ok, err = upload_file(local_path, r2_key)
            if ok:
                success_count += 1
            else:
                fail_count += 1
                if fail_count <= 5:
                    print(f"  FAILED: {fname}: {err}")

            # Progress every 100 files
            if (i + 1) % 100 == 0:
                print(f"  Progress: {i+1}/{total} (OK: {success_count}, FAIL: {fail_count})")

        print(f"  DONE: {success_count} uploaded, {fail_count} failed out of {total} total")

if __name__ == "__main__":
    main()
