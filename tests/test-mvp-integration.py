#!/usr/bin/env python3
"""
MVP Integration Test Script
Tests the complete flow from frontend → backend → AI service
"""

import requests
import json
import time
import sys

# Service URLs
AI_SERVICE_URL = "http://localhost:8000"
BACKEND_URL = "http://localhost:3001"
FRONTEND_URL = "http://localhost:5173"

def test_service_health():
    """Test if all services are running"""
    print("🔍 Testing service health...")
    
    services = {
        "AI Service": f"{AI_SERVICE_URL}/api/v1/health",
        "Backend API": f"{BACKEND_URL}/api/health",
    }
    
    for name, url in services.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: OK")
            else:
                print(f"❌ {name}: HTTP {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ {name}: Connection failed - {e}")
            return False
    
    return True

def test_ai_service_direct():
    """Test AI service directly"""
    print("\n🧠 Testing AI service directly...")
    
    test_data = {
        "record_id": "test-001",
        "symptoms": "headache and dizziness",
        "severity": 7,
        "character": "throbbing",
        "site": "frontal",
        "onset": "gradual over 2 hours"
    }
    
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/api/v1/analyze",
            json={"query": f"Patient has {test_data['symptoms']} with severity {test_data['severity']}/10"},
            headers={
                "Content-Type": "application/json",
                "X-API-Key": "ai-rag-demo-key-2024"
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            analysis = result.get('analysis', '')
            print("✅ AI Analysis successful")
            print(f"   - Analysis length: {len(analysis)} characters")
            print(f"   - Preview: {analysis[:100]}...")
            return True
        else:
            print(f"❌ AI Analysis failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ AI Service connection failed: {e}")
        return False

def test_backend_auth():
    """Test backend authentication"""
    print("\n🔐 Testing backend authentication...")
    
    # Test registration
    register_data = {
        "email": f"test-{int(time.time())}@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 201:
            result = response.json()
            token = result.get('data', {}).get('token')
            if token:
                print("✅ User registration successful")
                return token
            else:
                print("❌ Registration successful but no token received")
                return None
        else:
            print(f"❌ Registration failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connection failed: {e}")
        return None

def test_full_integration(auth_token):
    """Test full integration: create record → get analysis"""
    print("\n🔄 Testing full integration...")
    
    if not auth_token:
        print("❌ Cannot test integration without auth token")
        return False
    
    # Create health record
    record_data = {
        "record_date": "2024-12-10",
        "record_time": "14:30",
        "symptoms": "severe headache with nausea",
        "severity": 8,
        "character": "pounding",
        "site": "temporal",
        "onset": "sudden onset 1 hour ago",
        "medications": "ibuprofen",
        "associations": "stress at work",
        "time_course": "worsening",
        "exacerbating_factors": "bright lights",
        "palliating_factors": "dark room"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    }
    
    try:
        # Create record
        response = requests.post(
            f"{BACKEND_URL}/api/health-records",
            json=record_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 201:
            record = response.json().get('data', {})
            record_id = record.get('id')
            print(f"✅ Health record created (ID: {record_id})")
            
            # Get analysis
            if record_id:
                time.sleep(1)  # Brief pause
                analysis_response = requests.get(
                    f"{BACKEND_URL}/api/analysis/{record_id}",
                    headers=headers,
                    timeout=30
                )
                
                if analysis_response.status_code == 200:
                    analysis = analysis_response.json().get('data', {})
                    print("✅ AI analysis retrieved successfully")
                    print(f"   - Symptom severity: {analysis.get('symptomSeverity')}")
                    print(f"   - Risk factors: {len(analysis.get('riskFactors', []))}")
                    print(f"   - Recommendations: {len(analysis.get('recommendations', []))}")
                    print(f"   - Red flags: {len(analysis.get('redFlags', []))}")
                    return True
                else:
                    print(f"❌ Analysis failed: HTTP {analysis_response.status_code}")
                    return False
            else:
                print("❌ No record ID returned")
                return False
        else:
            print(f"❌ Record creation failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Integration test failed: {e}")
        return False

def main():
    """Run all MVP integration tests"""
    print("🚀 Health Journal MVP Integration Test")
    print("=" * 50)
    
    # Test 1: Service health
    if not test_service_health():
        print("\n❌ Service health check failed. Make sure all services are running.")
        sys.exit(1)
    
    # Test 2: AI service direct
    if not test_ai_service_direct():
        print("\n❌ AI service test failed.")
        sys.exit(1)
    
    # Test 3: Backend auth
    auth_token = test_backend_auth()
    
    # Test 4: Full integration
    if test_full_integration(auth_token):
        print("\n🎉 All MVP integration tests passed!")
        print("\nMVP is ready for use:")
        print(f"   - Frontend: {FRONTEND_URL}")
        print(f"   - Backend API: {BACKEND_URL}")
        print(f"   - AI Service: {AI_SERVICE_URL}")
    else:
        print("\n❌ Full integration test failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()