Feature: Test all the actions that are not allowed by rights

  Background:
  Given I go to the login page
  And I authenticate as "userfortests" with password "test"
  Then I am authenticated

  Scenario: I do not see the Add Collection button if I have no right
    When I go to collection browse page
    Then I do not see the Add Collection button

  @myTest
  Scenario: I am able to empty a collection only if I have the right to
    When I am on browse data page
    And I click on the collection selector
    And I click on a collection
    And I click on the cog
    Then I do not see the "Empty" menu item

  Scenario: I am able to edit a collection only if I have the right to
    When I am on browse data page
    And I click on the collection selector
    And I click on a collection
    And I click on the cog
    Then I do not see the Edit menu item

  Scenario: I am able to delete a collection only if I have the right to
    When I am on browse data page
    And I click on the collection selector
    And I click on a collection
    And I click on the cog
    Then I do not see the Delete menu item

  Scenario: I do not see the cog if I have no rights on the collection
    When I am on browse data page
    And I click on the collection selector
    And I click on a collection
    Then I do not see the cog

  Scenario: I don't see Add Collection
  Scenario: I don't see Add index
  Scenario: I can't delete an index
  Scenario: I can see security dongle

  @cleanDb
  Scenario: I can create document only if I have the right to
    Given I am on browse data page
    Then I click on the collection selector
    Then I click on collection "readonly-collection"
    Then I don't see the add document button

  @cleanDb
  Scenario: I can't edit document in collection "readonly-collection"
    Given I am on browse data page
    Then I click on the collection selector
    Then I click on collection "readonly-collection"
    Then I have a list with "1" element
    Then I can't edit the document in position "1"

  @cleanDb
  Scenario: I can't delete document in collection "readonly-collection"
    Given I am on browse data page
    Then I click on the collection selector
    Then I click on collection "readonly-collection"
    Then I have a list with "1" element
    Then I can't delete the document in position "1"

  @cleanDb @unsubscribe
  Scenario: I can't subscribe
    Given I go to the realtime page
    And I click on the collection selector
    Given I click on collection "private-collection"
    And I can't see filter form


  Scenario: I can't publish
    Given I go to the realtime page
    And I click on the collection selector
    Given I click on collection "private-collection"
    And I can't see publish form

  Scenario: Stat widget

  Scenario: Api widget

  Scenario: Empty dashboard
