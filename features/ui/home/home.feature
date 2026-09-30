@ui @smoke @home
Feature: Home page

Scenario: Guest can view the home page welcome content
    Given User opens the Restful Booker home page
    Then User should see the hotel welcome heading
    And User should see the main navigation links
    And User should see available rooms listed
    And User should see the booking section
    And User should see the contact section
