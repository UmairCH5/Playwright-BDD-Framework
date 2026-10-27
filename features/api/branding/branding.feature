@api @smoke @branding
Feature: Branding API

Scenario: User can view the hotel branding via the API
    When User requests the hotel branding via the API
    Then The API response status should be 200
    And The branding should show the hotel name
    And The branding should include contact details
