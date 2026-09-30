@ui @regression @admin
Feature: Admin messages

Scenario: Admin can view received messages
    Given User is logged in as admin from "admin"
    When User opens the admin messages page
    Then User should see messages listed
