@api @room
Feature: Room API

@smoke
Scenario: User can list rooms via the API
    When User requests the room list via the API
    Then The API response status should be 200
    And The room list should not be empty
    And Each room should have a name, type and price

@smoke
Scenario: User can view a single room via the API
    Given User has requested the room list via the API
    When User requests the first room via the API
    Then The API response status should be 200
    And The room should match the first room in the list

Scenario: Admin can create a room via the API
    Given Admin is authenticated via the API
    When Admin creates a room via the API from "single"
    Then The API response status should be 200
    And The created room should appear in the room list

Scenario: User cannot create a room via the API
    When User tries to create a room via the API from "single"
    Then The API response status should be 401
    And The API should return an authentication error
