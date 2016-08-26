Feature: Test multi index features
  As a user
  I want to browse indexes, select which index I am working on and create a new one

  @createIndex
  Background:
    Given I go to the login page
    And I authenticate as "admin"
    Then I am authenticated

  Scenario: I can select an index directly in the manage index page
    Given I go to manage index page
    And I click on the first index in manage index page
    And I am on browse collection page
    Then The index "kuzzle-bo-testindex" is selected

  Scenario: I can access the index creation page in manage index page
    Given I go to manage index page
    And I click on create index button
    Then I am on the index creation page

  @cleanFooIndex
  Scenario: I can create an index in index creation page
    Given I go to index creation page
    And I fill the input "name" with the foo index
    And I click on "create" button
    Then I am on the manage index page
    And I can see "2" indexes in list

  @createFooIndex
  Scenario: I can delete an index in manage index page
    Given I go to manage index page
    Then I can see "2" indexes in list
    When I click on the index option selector of the foo index
    And I click on Delete dropdown menu item of the foo index
    Then I can see "modal-delete-index" modal
    Then The button "modal-delete-index-delete" is disabled
    When I fill the input "modal-delete-index-name" with the foo index
    Then The button "modal-delete-index-delete" is not disabled
    When I click on "modal-delete-index-delete" button
    Then I can see "1" indexes in list

  Scenario: I can access to collection and to browse data quickly
    Given I go to manage index page
    And I click on the first index in manage index page
    Then I am on browse collection page
    When I click on the collection "kuzzle-bo-test" in collections list
    Then I am on browse data page for collection "kuzzle-bo-test"