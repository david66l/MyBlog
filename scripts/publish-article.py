#!/usr/bin/env python3
"""发布文章到 louis-dev 网站"""
import urllib.request, json, sys, os

API = "http://localhost:4000"
EMAIL = "admin@louis-dev.cloud"
PASSWORD = "admin123"

def login():
    data = json.dumps({"email": EMAIL, "password": PASSWORD}).encode()
    req = urllib.request.Request(f"{API}/auth/login", data=data,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())["token"]

def publish(markdown_text):
    token = login()
    data = json.dumps({"markdown": markdown_text}).encode()
    req = urllib.request.Request(f"{API}/admin/articles/import-markdown", data=data,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}, method="POST")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "delete-test":
        token = login()
        req = urllib.request.Request(f"{API}/admin/articles", headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as r:
            for a in json.loads(r.read()):
                if "test" in a.get("slug", ""):
                    did = a["id"]
                    req2 = urllib.request.Request(f"{API}/admin/articles/{did}", headers={"Authorization": f"Bearer {token}"}, method="DELETE")
                    with urllib.request.urlopen(req2) as r2:
                        print(f"Deleted {a['slug']} ({r2.status})")
    else:
        md = sys.stdin.read()
        result = publish(md)
        print(f"OK {result.get('slug')} | {result.get('status')} | {result.get('title')}")
