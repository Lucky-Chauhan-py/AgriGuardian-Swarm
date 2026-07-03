import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)
    
    print("Testing Root URL...")
    res = client.get("/")
    print(f"Status: {res.status_code}, Response: {res.json()}")
    print("-" * 50)
    
    print("Testing Login URL...")
    login_data = {"username": "farmer@agriguardian.com", "password": "farmer123"}
    res = client.post("/api/v1/auth/token", data=login_data)
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response: {res.text}")
        return
    
    token = res.json()["access_token"]
    print(f"Token: {token[:30]}...")
    headers = {"Authorization": f"Bearer {token}"}
    print("-" * 50)
    
    print("Testing /auth/me...")
    res = client.get("/api/v1/auth/me", headers=headers)
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response: {res.text}")
    else:
        print(f"Response: {res.json()}")
    print("-" * 50)
    
    print("Testing /farms...")
    res = client.get("/api/v1/farms", headers=headers)
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response: {res.text}")
    else:
        print(f"Response: {res.json()}")
    print("-" * 50)
    
    print("Testing /analytics...")
    res = client.get("/api/v1/analytics?farm_id=1", headers=headers)
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response: {res.text}")
    else:
        print(f"Response: {res.json()}")
    print("-" * 50)

if __name__ == "__main__":
    run_tests()
