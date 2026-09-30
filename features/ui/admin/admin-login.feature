@ui @smoke @admin
Feature: Admin login

Scenario: Admin can log in successfully
    Given User opens the admin login page
    When User logs in as admin from "admin"
    Then User should be on the admin rooms page
    And User should see the admin navigation
