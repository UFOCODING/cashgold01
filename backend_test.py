#!/usr/bin/env python3
"""
CashGold Backend API Testing Suite
Tests all authentication, deposit, withdrawal, investment, and admin endpoints
"""

import requests
import sys
import json
from datetime import datetime
import time

class CashGoldAPITester:
    def __init__(self, base_url="https://golden-invest-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.user_token = None
        self.test_user_email = f"testuser_{int(time.time())}@test.com"
        self.test_user_id = None
        self.admin_email = "admin@cashgold.com"
        self.admin_password = "admin123"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(name)
            print(f"✅ {name}")
        else:
            self.failed_tests.append({"test": name, "details": details})
            print(f"❌ {name} - {details}")

    def make_request(self, method, endpoint, data=None, token=None):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            
            return response
        except Exception as e:
            return None

    def test_user_registration(self):
        """Test user registration with referral code"""
        print("\n🔍 Testing User Registration...")
        
        # Test registration
        response = self.make_request('POST', 'auth/register', {
            "email": self.test_user_email,
            "username": "testuser",
            "password": "testpass123",
            "referral_code": None
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('requires_2fa'):
                self.log_test("User Registration", True)
                return True
            else:
                self.log_test("User Registration", False, "Expected 2FA requirement")
                return False
        else:
            self.log_test("User Registration", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_user_login(self):
        """Test user login"""
        print("\n🔍 Testing User Login...")
        
        response = self.make_request('POST', 'auth/login', {
            "email": self.test_user_email,
            "password": "testpass123"
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('requires_2fa'):
                self.log_test("User Login", True)
                return True
            else:
                self.log_test("User Login", False, "Expected 2FA requirement")
                return False
        else:
            self.log_test("User Login", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_admin_login_and_2fa(self):
        """Test admin login and 2FA verification"""
        print("\n🔍 Testing Admin Login and 2FA...")
        
        # Step 1: Admin login
        response = self.make_request('POST', 'auth/login', {
            "email": self.admin_email,
            "password": self.admin_password
        })
        
        if not response or response.status_code != 200:
            self.log_test("Admin Login", False, f"Status: {response.status_code if response else 'No response'}")
            return False
        
        data = response.json()
        if not data.get('requires_2fa'):
            self.log_test("Admin Login", False, "Expected 2FA requirement")
            return False
        
        self.log_test("Admin Login (2FA Required)", True)
        
        # Step 2: Use the 2FA code from backend logs
        # The code is logged in backend logs: 265343
        response = self.make_request('POST', 'auth/verify-2fa', {
            "email": self.admin_email,
            "code": "265343"
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get('access_token'):
                self.admin_token = data['access_token']
                self.log_test("Admin 2FA Verification", True)
                return True
            else:
                self.log_test("Admin 2FA Verification", False, "No access token in response")
                return False
        else:
            self.log_test("Admin 2FA Verification", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_deposit_wallet_endpoint(self):
        """Test deposit wallet endpoint"""
        print("\n🔍 Testing Deposit Wallet Endpoint...")
        
        if not self.admin_token:
            self.log_test("Deposit Wallet (No Token)", False, "No admin token available")
            return False
        
        response = self.make_request('GET', 'deposits/wallet', token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'wallet_address' in data and 'currency' in data:
                self.log_test("Deposit Wallet Endpoint", True)
                return True
            else:
                self.log_test("Deposit Wallet Endpoint", False, "Missing wallet_address or currency")
                return False
        else:
            self.log_test("Deposit Wallet Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_create_deposit(self):
        """Test creating a deposit"""
        print("\n🔍 Testing Create Deposit...")
        
        if not self.admin_token:
            self.log_test("Create Deposit (No Token)", False, "No admin token available")
            return False
        
        response = self.make_request('POST', 'deposits', {
            "amount": 100.0,
            "tx_hash": "test_tx_hash_123"
        }, token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'deposit_id' in data:
                self.log_test("Create Deposit", True)
                return data['deposit_id']
            else:
                self.log_test("Create Deposit", False, "Missing deposit_id in response")
                return None
        else:
            self.log_test("Create Deposit", False, f"Status: {response.status_code if response else 'No response'}")
            return None

    def test_create_withdrawal(self):
        """Test creating a withdrawal"""
        print("\n🔍 Testing Create Withdrawal...")
        
        if not self.admin_token:
            self.log_test("Create Withdrawal (No Token)", False, "No admin token available")
            return False
        
        response = self.make_request('POST', 'withdrawals', {
            "amount": 50.0,
            "wallet_address": "TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1"
        }, token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'withdrawal_id' in data:
                self.log_test("Create Withdrawal", True)
                return data['withdrawal_id']
            else:
                self.log_test("Create Withdrawal", False, "Missing withdrawal_id in response")
                return None
        else:
            self.log_test("Create Withdrawal", False, f"Status: {response.status_code if response else 'No response'}")
            return None

    def test_create_investment(self):
        """Test creating an investment"""
        print("\n🔍 Testing Create Investment...")
        
        if not self.admin_token:
            self.log_test("Create Investment (No Token)", False, "No admin token available")
            return False
        
        response = self.make_request('POST', 'investments', {
            "amount": 100.0
        }, token=self.admin_token)
        
        if response and response.status_code == 200:
            data = response.json()
            if 'investment_id' in data:
                self.log_test("Create Investment", True)
                return data['investment_id']
            else:
                self.log_test("Create Investment", False, "Missing investment_id in response")
                return None
        else:
            self.log_test("Create Investment", False, f"Status: {response.status_code if response else 'No response'}")
            return None

    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        print("\n🔍 Testing Admin Endpoints...")
        
        if not self.admin_token:
            self.log_test("Admin Endpoints (No Token)", False, "No admin token available")
            return False
        
        # Test admin stats
        response = self.make_request('GET', 'admin/stats', token=self.admin_token)
        if response and response.status_code == 200:
            self.log_test("Admin Stats", True)
        else:
            self.log_test("Admin Stats", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test admin deposits
        response = self.make_request('GET', 'admin/deposits', token=self.admin_token)
        if response and response.status_code == 200:
            self.log_test("Admin Deposits List", True)
        else:
            self.log_test("Admin Deposits List", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test admin withdrawals
        response = self.make_request('GET', 'admin/withdrawals', token=self.admin_token)
        if response and response.status_code == 200:
            self.log_test("Admin Withdrawals List", True)
        else:
            self.log_test("Admin Withdrawals List", False, f"Status: {response.status_code if response else 'No response'}")
        
        # Test admin users
        response = self.make_request('GET', 'admin/users', token=self.admin_token)
        if response and response.status_code == 200:
            self.log_test("Admin Users List", True)
        else:
            self.log_test("Admin Users List", False, f"Status: {response.status_code if response else 'No response'}")

    def test_unauthorized_access(self):
        """Test endpoints without proper authentication"""
        print("\n🔍 Testing Unauthorized Access...")
        
        # Test protected endpoint without token
        response = self.make_request('GET', 'auth/me')
        if response and response.status_code == 401:
            self.log_test("Unauthorized Access Protection", True)
        else:
            self.log_test("Unauthorized Access Protection", False, f"Expected 401, got {response.status_code if response else 'No response'}")
        
        # Test admin endpoint without admin token
        response = self.make_request('GET', 'admin/stats')
        if response and response.status_code == 401:
            self.log_test("Admin Endpoint Protection", True)
        else:
            self.log_test("Admin Endpoint Protection", False, f"Expected 401, got {response.status_code if response else 'No response'}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting CashGold Backend API Tests...")
        print(f"📡 Testing API at: {self.base_url}")
        
        # Test basic authentication flow
        self.test_user_registration()
        self.test_user_login()
        self.test_admin_login_and_2fa()
        
        # Test core functionality
        self.test_deposit_wallet_endpoint()
        self.test_create_deposit()
        self.test_create_withdrawal()
        self.test_create_investment()
        
        # Test admin functionality
        self.test_admin_endpoints()
        
        # Test security
        self.test_unauthorized_access()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return self.tests_passed, self.tests_run, self.failed_tests, self.passed_tests

def main():
    tester = CashGoldAPITester()
    passed, total, failed, passed_list = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if len(failed) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())