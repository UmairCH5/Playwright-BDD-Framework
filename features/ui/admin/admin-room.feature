@ui @regression @admin
Feature: Admin rooms

Scenario: Admin can view existing rooms
    Given User is logged in as admin from "admin"
    Then User should see the admin room form
    And User should see rooms listed in the admin room list

Scenario: Admin can create a new room
    Given User is logged in as admin from "admin"
    When User creates a room from "single"
    Then User should see the created room from "single" in the room list
