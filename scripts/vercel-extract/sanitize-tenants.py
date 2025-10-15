#!/usr/bin/env python3
"""
Sanitize tenant NDJSON lines: detect base64 logos and either remove or flag them.
Usage:
  python3 sanitize-tenants.py recovered-tenants.ndjson sanitized-tenants.ndjson

This script does not upload images. It replaces long base64 strings with a placeholder and emits metadata fields:
  _logo_stripped: true/false
  _logo_reason: reason string

"""
import sys
import json
import re

BASE64_THRESHOLD = 200  # if a string is > this length and matches base64 pattern, treat as embedded image
BASE64_RE = re.compile(r'^(?:data:[^;]+;base64,)?[A-Za-z0-9+/=\n\r]+$')


def sanitize(obj):
    changed = False
    reason = None
    # common fields
    for key in list(obj.keys()):
        if key.lower() in ("logo", "image", "logoBase64", "logo_b64"):
            val = obj.get(key)
            if isinstance(val, str) and len(val) > BASE64_THRESHOLD and BASE64_RE.match(val.replace('\n','').replace('\r','')):
                obj[key] = None
                obj["_logo_stripped"] = True
                obj["_logo_reason"] = f"stripped {key}: base64 length {len(val)}"
                changed = True
                reason = obj["_logo_reason"]
    # nested assets
    assets = obj.get('assets') or obj.get('meta') or {}
    if isinstance(assets, dict):
        for k, v in list(assets.items()):
            if isinstance(v, str) and len(v) > BASE64_THRESHOLD and BASE64_RE.match(v.replace('\n','').replace('\r','')):
                assets[k] = None
                obj["_logo_stripped"] = True
                obj["_logo_reason"] = f"stripped assets.{k}: base64 length {len(v)}"
                changed = True
                reason = obj["_logo_reason"]
    return obj


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: sanitize-tenants.py input.ndjson output.ndjson")
        sys.exit(2)
    inp = sys.argv[1]
    outp = sys.argv[2]
    count = 0
    stripped = 0
    with open(inp, 'r') as inf, open(outp, 'w') as outf:
        for line in inf:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except Exception:
                # try to extract JSON substring
                m = re.search(r"\{.*\}", line)
                if not m:
                    continue
                obj = json.loads(m.group(0))
            count += 1
            obj2 = sanitize(obj)
            if obj2.get('_logo_stripped'):
                stripped += 1
            outf.write(json.dumps(obj2) + '\n')
    print(f"Processed {count} lines, stripped logos from {stripped} items")
