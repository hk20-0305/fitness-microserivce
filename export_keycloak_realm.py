import json, urllib.request, urllib.parse

BASE = "http://localhost:8181"

data = urllib.parse.urlencode({
    "username": "admin",
    "password": "admin",
    "grant_type": "password",
    "client_id": "admin-cli"
}).encode()
req = urllib.request.Request(f"{BASE}/realms/master/protocol/openid-connect/token", data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
with urllib.request.urlopen(req) as resp:
    token = json.load(resp)["access_token"]

headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}

# Export realm
req = urllib.request.Request(f"{BASE}/admin/realms/fitness-oauth2", headers=headers)
with urllib.request.urlopen(req) as resp:
    realm = json.load(resp)

# Clients
req = urllib.request.Request(f"{BASE}/admin/realms/fitness-oauth2/clients", headers=headers)
with urllib.request.urlopen(req) as resp:
    realm["clients"] = json.load(resp)

# Client scopes
req = urllib.request.Request(f"{BASE}/admin/realms/fitness-oauth2/client-scopes", headers=headers)
with urllib.request.urlopen(req) as resp:
    realm["clientScopes"] = json.load(resp)

# Roles
req = urllib.request.Request(f"{BASE}/admin/realms/fitness-oauth2/roles", headers=headers)
with urllib.request.urlopen(req) as resp:
    realm["roles"] = {"realm": json.load(resp)}

# Users
req = urllib.request.Request(f"{BASE}/admin/realms/fitness-oauth2/users?max=1000", headers=headers)
with urllib.request.urlopen(req) as resp:
    realm["users"] = json.load(resp)

with open("fitness-oauth2-realm.json", "w", encoding="utf-8") as f:
    json.dump(realm, f, indent=2, ensure_ascii=False)

print("Realm exported successfully to fitness-oauth2-realm.json")
print(f"Clients: {len(realm['clients'])}")
print(f"Users: {len(realm['users'])}")
print(f"Roles: {len(realm['roles']['realm'])}")