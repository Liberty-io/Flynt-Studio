import requests
import sys

URL = "http://localhost:3000/"

try:
    resp = requests.get(URL, timeout=10)
    print(f"STATUS: {resp.status_code}")
    print(f"CONTENT-TYPE: {resp.headers.get('content-type')}")
    body = resp.text or ""
    print("--- BODY (first 1000 chars) ---")
    print(body[:1000])
    print("--- END ---")
    sys.exit(0 if resp.status_code < 400 else 2)
except Exception as e:
    print("ERROR:", str(e))
    sys.exit(3)
