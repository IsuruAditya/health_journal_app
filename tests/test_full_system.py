#!/usr/bin/env python3
"""
End-to-End System Test
Tests: Frontend → Backend → AI Microservice integration
"""
import requests
import json
import time
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:3001/api"
AI_SERVICE_URL = "http://localhost:8000/api/v1"
AI_API_KEY = "ai-rag-demo-key-2024"

class SystemTester:
    def __init__(self):
        self.token = None
        self.user_email = f"test_{int(time.time())}@test.com"
        self.record_id = None
        
    def print_step(self, step, message):
        print(f"\n{'='*60}")
        print(f"STEP {step}: {message}")
        print('='*60)
    
    def print_result(self, success, message, data=None):
        icon = "✅" if success else "❌"
        print(f"{icon} {message}")
        if data:
            print(f"   Data: {json.dumps(data, indent=2)[:200]}...")
    
    # ==================== BACKEND TESTS ====================
    
    def test_backend_health(self):
        """Test backend health endpoint"""
        self.print_step(1, "Testing Backend Health")
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=5)
            self.print_result(
                response.status_code == 200,
                f"Backend health check (Status: {response.status_code})",
                response.json() if response.status_code == 200 else None
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result(False, f"Backend health check failed: {e}")
            return False
    
    def test_user_registration(self):
        """Test user registration"""
        self.print_step(2, "Testing User Registration")
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/register",
                json={"email": self.user_email, "password": "Test123!"},
                timeout=10
            )
            if response.status_code == 201:
                data = response.json()
                self.token = data['data']['token']
                self.print_result(True, "User registered successfully", data)
                return True
            else:
                self.print_result(False, f"Registration failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Registration error: {e}")
            return False
    
    def test_user_login(self):
        """Test user login"""
        self.print_step(3, "Testing User Login")
        try:
            response = requests.post(
                f"{BACKEND_URL}/auth/login",
                json={"email": self.user_email, "password": "Test123!"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data['data']['token']
                self.print_result(True, "User logged in successfully", data)
                return True
            else:
                self.print_result(False, f"Login failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Login error: {e}")
            return False
    
    def test_create_health_record(self):
        """Test creating a health record"""
        self.print_step(4, "Testing Create Health Record")
        
        record_data = {
            "record_date": datetime.now().strftime("%Y-%m-%d"),
            "record_time": datetime.now().strftime("%H:%M"),
            "site": "chest",
            "onset": "sudden, 2 hours ago",
            "character": "sharp, stabbing pain",
            "radiation": "left arm",
            "associations": "shortness of breath, sweating",
            "time_course": "constant, getting worse",
            "exacerbating_factors": "movement, deep breathing",
            "severity": 8,
            "palliating_factors": "rest",
            "symptoms": "chest pain, difficulty breathing, nausea",
            "medications": "aspirin 81mg",
            "vital_signs": {
                "blood_pressure": "160/95",
                "pulse": "110",
                "temperature": "98.6"
            },
            "personal_notes": "Very concerned about these symptoms"
        }
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/health-records",
                json=record_data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if response.status_code == 201:
                data = response.json()
                self.record_id = data['data']['id']
                self.print_result(True, f"Health record created (ID: {self.record_id})", data)
                return True
            else:
                self.print_result(False, f"Create record failed (Status: {response.status_code})")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            self.print_result(False, f"Create record error: {e}")
            return False
    
    def test_get_health_records(self):
        """Test retrieving health records"""
        self.print_step(5, "Testing Get Health Records")
        try:
            response = requests.get(
                f"{BACKEND_URL}/health-records",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                count = len(data['data'])
                self.print_result(True, f"Retrieved {count} health records", {"count": count})
                return True
            else:
                self.print_result(False, f"Get records failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Get records error: {e}")
            return False
    
    def test_get_single_record(self):
        """Test retrieving a single health record"""
        self.print_step(6, "Testing Get Single Health Record")
        if not self.record_id:
            self.print_result(False, "No record ID available")
            return False
        
        try:
            response = requests.get(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                self.print_result(True, f"Retrieved record ID: {self.record_id}", data)
                return True
            else:
                self.print_result(False, f"Get single record failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Get single record error: {e}")
            return False
    
    def test_update_health_record(self):
        """Test updating a health record"""
        self.print_step(7, "Testing Update Health Record")
        if not self.record_id:
            self.print_result(False, "No record ID available")
            return False
        
        update_data = {
            "record_date": datetime.now().strftime("%Y-%m-%d"),
            "record_time": datetime.now().strftime("%H:%M"),
            "site": "chest",
            "severity": 6,
            "symptoms": "chest pain improving with rest",
            "personal_notes": "Symptoms improving after taking aspirin"
        }
        
        try:
            response = requests.put(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                json=update_data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                self.print_result(True, f"Updated record ID: {self.record_id}", data)
                return True
            else:
                self.print_result(False, f"Update record failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Update record error: {e}")
            return False
    
    # ==================== AI MICROSERVICE TESTS ====================
    
    def test_ai_service_health(self):
        """Test AI microservice health"""
        self.print_step(8, "Testing AI Microservice Health")
        try:
            response = requests.get(
                f"{AI_SERVICE_URL}/health",
                headers={"X-API-Key": AI_API_KEY},
                timeout=10
            )
            self.print_result(
                response.status_code == 200,
                f"AI service health check (Status: {response.status_code})",
                response.json() if response.status_code == 200 else None
            )
            return response.status_code == 200
        except Exception as e:
            self.print_result(False, f"AI service health check failed: {e}")
            return False
    
    def test_ai_analysis(self):
        """Test AI health analysis via backend"""
        self.print_step(9, "Testing AI Health Analysis (via Backend)")
        if not self.record_id:
            self.print_result(False, "No record ID available")
            return False
        
        try:
            print("⏳ Analyzing... (this may take 30-90 seconds due to rate limits)")
            response = requests.get(
                f"{BACKEND_URL}/analysis/{self.record_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=120
            )
            if response.status_code == 200:
                data = response.json()
                analysis = data['data']
                self.print_result(True, "AI analysis completed", {
                    "recommendations_count": len(analysis.get('recommendations', [])),
                    "risk_factors_count": len(analysis.get('riskFactors', [])),
                    "red_flags_count": len(analysis.get('redFlags', []))
                })
                print(f"\n📊 Analysis Summary:")
                print(f"   Recommendations: {analysis.get('recommendations', [])[:2]}")
                print(f"   Risk Factors: {analysis.get('riskFactors', [])[:2]}")
                return True
            else:
                self.print_result(False, f"AI analysis failed (Status: {response.status_code})")
                print(f"   Response: {response.text[:200]}")
                return False
        except Exception as e:
            self.print_result(False, f"AI analysis error: {e}")
            return False
    
    def test_direct_ai_analysis(self):
        """Test direct AI microservice analysis"""
        self.print_step(10, "Testing Direct AI Microservice Analysis")
        
        query = "Patient with severe chest pain radiating to left arm, shortness of breath, BP 160/95"
        
        try:
            print("⏳ Analyzing... (this may take 30-90 seconds due to rate limits)")
            response = requests.post(
                f"{AI_SERVICE_URL}/analyze",
                json={"query": query},
                headers={"X-API-Key": AI_API_KEY},
                timeout=120
            )
            if response.status_code == 200:
                data = response.json()
                analysis_text = data.get('analysis', '')
                self.print_result(True, "Direct AI analysis completed", {
                    "analysis_length": len(analysis_text),
                    "preview": analysis_text[:150]
                })
                return True
            else:
                self.print_result(False, f"Direct AI analysis failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Direct AI analysis error: {e}")
            return False
    
    def test_delete_health_record(self):
        """Test deleting a health record"""
        self.print_step(11, "Testing Delete Health Record")
        if not self.record_id:
            self.print_result(False, "No record ID available")
            return False
        
        try:
            response = requests.delete(
                f"{BACKEND_URL}/health-records/{self.record_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            if response.status_code == 200:
                self.print_result(True, f"Deleted record ID: {self.record_id}")
                return True
            else:
                self.print_result(False, f"Delete record failed (Status: {response.status_code})")
                return False
        except Exception as e:
            self.print_result(False, f"Delete record error: {e}")
            return False
    
    # ==================== RUN ALL TESTS ====================
    
    def run_all_tests(self):
        """Run all system tests"""
        print("\n" + "="*60)
        print("🚀 STARTING FULL SYSTEM TEST")
        print("="*60)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"AI Service URL: {AI_SERVICE_URL}")
        print(f"Test User: {self.user_email}")
        
        results = []
        
        # Backend Tests
        results.append(("Backend Health", self.test_backend_health()))
        results.append(("User Registration", self.test_user_registration()))
        results.append(("User Login", self.test_user_login()))
        results.append(("Create Health Record", self.test_create_health_record()))
        results.append(("Get Health Records", self.test_get_health_records()))
        results.append(("Get Single Record", self.test_get_single_record()))
        results.append(("Update Health Record", self.test_update_health_record()))
        
        # AI Microservice Tests (with delays to avoid rate limiting)
        results.append(("AI Service Health", self.test_ai_service_health()))
        time.sleep(3)  # Wait between tests
        results.append(("AI Analysis (Backend)", self.test_ai_analysis()))
        time.sleep(5)  # Wait for rate limit reset
        results.append(("Direct AI Analysis", self.test_direct_ai_analysis()))
        
        # Cleanup
        results.append(("Delete Health Record", self.test_delete_health_record()))
        
        # Summary
        self.print_summary(results)
    
    def print_summary(self, results):
        """Print test summary"""
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            icon = "✅" if result else "❌"
            print(f"{icon} {test_name}")
        
        print("\n" + "-"*60)
        print(f"Total: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! System is working perfectly!")
        elif passed >= total * 0.8:
            print("⚠️  Most tests passed. Check failed tests above.")
        else:
            print("❌ Multiple tests failed. System needs attention.")
        
        print("="*60 + "\n")

if __name__ == "__main__":
    tester = SystemTester()
    tester.run_all_tests()
