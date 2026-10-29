@api @smoke @auth
Feature: Auth API

Scenario: Admin can log in via the API
    When Admin logs in via the API with valid credentials
    Then The API response status should be 200
    And The API should return an auth token
    And The returned auth token should be valid

Scenario: Admin cannot log in via the API with an invalid password
    When Admin logs in via the API with an invalid password
    Then The API response status should be 401
    And The API should return an invalid credentials error
