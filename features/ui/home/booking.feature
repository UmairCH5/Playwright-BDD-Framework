@ui @smoke @home
Feature: Booking page

Scenario: Guest can book the room
    Given User opens the Restful Booker booking page
    When User enters booking dates from "validBooking"
    When User clicks check availability
    Then User should be able to see available rooms
    When User clicks the first Book now button
    When User clicks the Reserve Now button
    When User fills the booking form from "validBooking"
    When User confirms the reservation
    Then User should see the booking confirmation
    And User should see the confirmed dates from "validBooking"
    And User should see the return home link
