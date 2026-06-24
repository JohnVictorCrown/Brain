#!/usr/bin/env python3
"""
rename-notion-uuid.py

Recursively removes Notion-style 32-char hex UUIDs from filenames in the
Stellarium Foundation/Notion Archive directory.

Pattern: Files like "Name 2cbc1c04bbc180b8af10c967ff22cddc.md" → "Name.md"
         Directories like "157c1c04bbc1814cbf420042e8363925/" → prompted for new name

Usage:
    python rename-notion-uuid.py          # dry run (preview only)
    python rename-notion-uuid.py --apply  # actually rename files
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# The 32-char hex pattern Notion appends to exported files/dirs
UUID_PATTERN = re.compile(r'[0-9a-f]{32}')
UUID_IN_NAME = re.compile(r' ([0-9a-f]{32})$')

# Root directory to process
ROOT = Path(__file__).parent / "Stellarium Foundation" / "Notion Archive"


def is_uuid_only(name: str) -> bool:
    """Check if the entire name is just a UUID (directory with no meaningful name)."""
    return bool(UUID_PATTERN.fullmatch(name))


def has_trailing_uuid(name: str) -> bool:
    """Check if name ends with ' <32-hex-chars>' before extension (or as whole dirname)."""
    stem = name.rsplit('.', 1)[0] if '.' in name else name
    return bool(UUID_IN_NAME.search(stem))


def strip_uuid(name: str) -> str:
    """Remove the trailing UUID from a filename or dirname."""
    stem, *ext_parts = name.rsplit('.', 1)
    ext = '.' + ext_parts[0] if ext_parts else ''
    m = UUID_IN_NAME.search(stem)
    if m:
        stem = stem[:m.start()]
    return stem + ext


def gather_paths(root: Path):
    """Collect all files and dirs that have UUIDs in their names."""
    files_with_uuid = []
    uuid_only_dirs = []
    dirs_with_uuid = []

    for dirpath, dirnames, filenames in os.walk(root):
        dirpath = Path(dirpath)
        # Filter dirs
        for d in list(dirnames):
            if is_uuid_only(d):
                uuid_only_dirs.append(dirpath / d)
            elif has_trailing_uuid(d):
                dirs_with_uuid.append(dirpath / d)
        # Filter files
        for f in filenames:
            if has_trailing_uuid(f):
                files_with_uuid.append(dirpath / f)

    return files_with_uuid, uuid_only_dirs, dirs_with_uuid


def detect_collisions(paths, root: Path):
    """Check which renames would collide (same new name from different old names)."""
    collisions = defaultdict(list)
    for p in paths:
        new_name = strip_uuid(p.name)
        new_path = p.parent / new_name
        collisions[new_path].append(p)

    return {k: v for k, v in collisions.items() if len(v) > 1}


def safe_rename(path: Path, new_name: str, dry_run: bool) -> bool:
    """Rename a file/dir, handling collisions by appending (1), (2), etc."""
    new_path = path.parent / new_name
    if new_path == path:
        return False
    # Handle collisions: if target already exists, append a number
    stem, *ext_parts = new_name.rsplit('.', 1)
    ext = '.' + ext_parts[0] if ext_parts else ''
    counter = 1
    while not dry_run and new_path.exists():
        new_path = path.parent / f"{stem} ({counter}){ext}"
        counter += 1
    if dry_run:
        rel = path.relative_to(ROOT)
        new_rel = new_path.relative_to(ROOT)
        if counter > 1:
            print(f"  {rel}  (collision → {new_rel})")
        else:
            print(f"  {rel}")
            print(f"    → {new_rel}")
    else:
        old_name = path.name
        new_final = new_path.name
        arrow = f"" if old_name == new_final else f"  → {new_final}"
        print(f"  {old_name}{arrow}")
        os.rename(str(path), str(new_path))
    return True


def rename_file(path: Path, dry_run: bool) -> bool:
    """Rename a single file by stripping its trailing UUID."""
    new_name = strip_uuid(path.name)
    return safe_rename(path, new_name, dry_run)


def handle_uuid_only_dir(path: Path, new_name: str, dry_run: bool) -> bool:
    """Rename a UUID-only directory to the given new_name."""
    return safe_rename(path, new_name, dry_run)


def main():
    apply = '--apply' in sys.argv
    dry_run = not apply

    if not ROOT.exists():
        print(f"Error: Directory not found: {ROOT}")
        sys.exit(1)

    print(f"{'='*60}")
    print(f"{'APPLYING RENAMES' if apply else 'DRY RUN — no changes made'}")
    print(f"Directory: {ROOT}")
    print(f"{'='*60}\n")

    files_with_uuid, uuid_only_dirs, dirs_with_uuid = gather_paths(ROOT)

    # --- Check for collisions first ---
    all_paths = files_with_uuid + uuid_only_dirs + dirs_with_uuid
    collisions = detect_collisions(all_paths, ROOT)
    if collisions:
        print("⚠️  COLLISIONS DETECTED — these would map to the same name:")
        for new_path, old_paths in sorted(collisions.items()):
            print(f"\n  Target: {new_path.relative_to(ROOT)}")
            for old in old_paths:
                print(f"    ← {old.relative_to(ROOT)}")
        print(f"\n{'='*60}\n")

    # --- Files with trailing UUID ---
    total_files = len(files_with_uuid)
    print(f"\n📄 Files with trailing UUID: {total_files}")
    if total_files == 0:
        print("  (none found)")
    else:
        for fp in sorted(files_with_uuid):
            rename_file(fp, dry_run)

    # --- Dirs with trailing UUID ---
    total_dirs = len(dirs_with_uuid)
    print(f"\n📁 Directories with trailing UUID: {total_dirs}")
    if total_dirs == 0:
        print("  (none found)")
    else:
        # Rename children first (deepest first) by sorting in reverse
        for dp in sorted(dirs_with_uuid, reverse=True):
            new_name = strip_uuid(dp.name)
            new_path = dp.parent / new_name
            if new_path == dp:
                continue
            if dry_run:
                print(f"  {dp.relative_to(ROOT)}/")
                print(f"    → {new_path.relative_to(ROOT)}/")
            else:
                print(f"  {dp.name}/")
                print(f"    → {new_name}/")
                os.rename(str(dp), str(new_path))

    # --- UUID-only directories ---
    total_uuid_only = len(uuid_only_dirs)
    print(f"\n🗂️  UUID-only directories (need new names): {total_uuid_only}")
    if total_uuid_only == 0:
        print("  (none found)")
    else:
        for dp in sorted(uuid_only_dirs, reverse=True):
            parent_name = dp.parent.name
            # Auto-name based on parent directory
            suggested = parent_name.lower().replace(' ', '_')
            print(f"\n  📁 {dp.relative_to(ROOT)}/")
            if dry_run:
                print(f"    → {suggested}/")
            else:
                print(f"    → {suggested}/")
                handle_uuid_only_dir(dp, suggested, dry_run=False)

    # --- Summary ---
    print(f"\n{'='*60}")
    total = total_files + total_dirs + total_uuid_only
    if dry_run:
        print(f"✅ Dry run complete. {total} items would be renamed.")
        print(f"   Run with --apply to execute:  python rename-notion-uuid.py --apply")
    else:
        print(f"✅ Done! {total} items renamed.")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
