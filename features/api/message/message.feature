@api @message
Feature: Message API

@smoke
Scenario: User can submit a contact message via the API
    When User submits a contact message via the API from "validContact"
    Then The API response status should be 200
    And The submitted message should appear in the message list
    And The submitted message should be readable via the API

Scenario: User cannot submit an invalid contact message via the API
    When User submits an empty contact message via the API
    Then The API response status should be 400
    And The API should return message validation errors

@smoke
Scenario: Admin can list received messages via the API
    When Admin requests the message list via the API
    Then The API response status should be 200
    And The message list should not be empty
