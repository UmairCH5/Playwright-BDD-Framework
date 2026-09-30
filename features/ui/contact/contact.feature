@ui @smoke @contact
Feature: Contact page

Scenario: Guest can view the contact form
    Given User opens the Restful Booker contact page
    Then User should see the contact form

Scenario: Guest can submit a contact message
    Given User opens the Restful Booker contact page
    When User fills the contact form from "validContact"
    And User submits the contact form
    Then User should see the contact success message for "validContact"
