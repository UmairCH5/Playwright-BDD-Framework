@api @booking
Feature: Booking API

@smoke
Scenario: User can create a booking via the API
    Given User has requested the room list via the API
    When User creates a booking via the API from "validBooking"
    Then The API response status should be 201
    And The booking should echo the user and dates from "validBooking"
    When Admin retrieves the booking via the API
    Then The retrieved booking should match the created booking
    And The booking should appear in the room booking summary

Scenario: User cannot create a booking via the API without user names
    Given User has requested the room list via the API
    When User creates a booking via the API without user names
    Then The API response status should be 400
    And The API should return a firstname validation error

Scenario: User cannot view booking details via the API without authentication
    Given User has requested the room list via the API
    When User creates a booking via the API from "validBooking"
    And User tries to view the booking via the API without authentication
    Then The API response status should be 403
