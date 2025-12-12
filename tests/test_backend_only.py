#!/usr/bin/env python3
"""
Backend-Only System Test (Fast)
Tests: Frontend → Backend → PostgreSQL
"""
import requests
import json
import time
from datetime import datetime

BACKEND_URL = "http://localhost:3001/api"

class BackendTester:
    def __init__(self):
        self.token = None
        self.user_email = f"test_{int(time.time())}@test.com"
        self.record_id = None
        
    def test(self, name, func):
        """Run a test and return result"""
        print(f"\n{'='*50}")
        print(f"TEST: {name}")
        print('='*50)
        try:
            result = func()
            icon = "✅" if result else "❌"
            print(f"{icon} {name}: {'PASS' if result else 'FAIL'}")
            return result
        except Exception as e:
            print(f"❌ {name}: ERROR - {e}")
            return False
    
    def run_all(self):
        """Run all backend tests"""
        print("\n🚀 BACKEND SYSTEM TEST")
        print(f"Backend: {BACKEND_URL}")
        print(f"User: {self.user_email}\n")
        
        results = []
        
        # Test 1: Health Check
        def health():
            r = requests.get(f"{BACKEND_URL}/health", timeout=5)
            print(f"   Status: {r.status_code}")
            return r.status_code == 200
        results.append(self.test("Backend Health", health))
        
        # Test 2: Register
        def register():
            r = requests.post(
                f"{BACKEND_URL}/auth/register",
                json={"email": self.user_email, "password": "Test123!"},
                timeout=10
            )
            if r.status_code == 201:
                self.token = r.json()['data']['token']
                print(f"   Token: {self.token[:20]}...")
                return True
            return False
        results.append(self.test("User Registration", register))
        
        # Test 3: Login
        def login():
            r = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={"email": self.user_email, "password": "Test123!"},
                timeout=10
            )
            if r.status_code == 200:
                self.token = r.json()['data']['token']
                print(f"   Token refreshed")
                return True
            return False
        results.append(self.test("User Login", login))
        
        # Test 4: Create Record
        def create():
            r = requests.post(
                f"{BACKEND_URL}/health-records",
                json={
                    "record_date": datetime.now().strftime("%Y-%m-%d"),
                    "record_time": datetime.now().strftime("%H:%M"),
                    "site": "chest",
                    "severity": 8,
                    "symptoms": "chest pain, shortness of breath"
                },
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if r.status_code == 201:
                self.record_id = r.json()['data']['id']
                print(f"   Record ID: {self.record_id}")
                return True
            return False
        results.append(self.test("Create Health Record", create))
        
        # Test 5: Get All Records
        def get_all():
            r = requests.get(
                f"{BACKEND_URL}/health-records",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if r.status_code == 200:
                count = len(r.json()['data'])
                print(f"   Found {count} records")
                return count > 0
            return False
        results.append(self.test("Get All Records", get_all))
        
        # Test 6: Get Single Record
        def get_one():
            r = requests.get(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if r.status_code == 200:
                data = r.json()['data']
                print(f"   Severity: {data['severity']}/10")
                return True
            return False
        results.append(self.test("Get Single Record", get_one))
        
        # Test 7: Update Record
        def update():
            r = requests.put(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                json={
                    "record_date": datetime.now().strftime("%Y-%m-%d"),
                    "record_time": datetime.now().strftime("%H:%M"),
                    "severity": 5,
                    "symptoms": "improving"
                },
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if r.status_code == 200:
                print(f"   Updated severity to 5/10")
                return True
            return False
        results.append(self.test("Update Record", update))
        
        # Test 8: Delete Record
        def delete():
            r = requests.delete(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if r.status_code == 200:
                print(f"   Record {self.record_id} deleted")
                return True
            return False
        results.append(self.test("Delete Record", delete))
        
        # Summary
        print("\n" + "="*50)
        print("📊 SUMMARY")
        print("="*50)
        passed = sum(results)
        total = len(results)
        print(f"Passed: {passed}/{total} ({passed/total*100:.0f}%)")
        
        if passed == total:
            print("🎉 ALL BACKEND TESTS PASSED!")
        else:
            print("⚠️  Some tests failed")
        print("="*50 + "\n")

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_all()
