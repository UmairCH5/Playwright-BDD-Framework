@ui @regression @admin
Feature: Admin bookings report

Scenario: Admin can view the bookings calendar
    Given User is logged in as admin from "admin"
    When User opens the admin bookings report
    Then User should see the bookings calendar
