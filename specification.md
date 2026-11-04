# Feature Specification: ArtisanLink Craft Marketplace

**Feature Branch**: `001-artisanlink-marketplace`  
**Created**: 2026-11-04  
**Status**: Draft  
**Input**: User description: "Create a project specification for ArtisanLink, including listing creation, discovery, item details, artisan contact, acceptance criteria, API endpoints, and implementation priority."

## Project Overview

**Project title**: ArtisanLink  
**Description**: A marketplace-style catalog where people can discover craft items and contact the artisans who make them.  
**Purpose**: Help artisans present their work and help interested buyers find and reach them.  
**Target audience**: Artisans who add craft listings and people browsing those listings, including international visitors using category and country filters.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Add a craft item (Priority: P1)

An authorized creator adds a craft item so it can be discovered in the ArtisanLink catalog.

**Why this priority**: The catalog needs artisan listings to provide value to browsers.

**Independent Test**: Submit one valid item, then confirm it is available from the catalog and its detail page.

**Acceptance Scenarios**:

1. **Given** a creator with permission to add an item and the required item information, **When** they submit the item, **Then** exactly one item is saved and becomes available in the catalog.
2. **Given** a submission missing a required value or a usable contact method, **When** it is submitted, **Then** the item is not saved and the creator is told which information needs correction.
3. **Given** an item is saved, **When** its detail page is opened, **Then** the saved title, description, category, country, artisan name, and provided contact details are shown.
4. **Given** a person who does not own an artisan account, **When** they attempt to submit an item, **Then** the item is not saved and access is denied.

### User Story 2 - Browse and filter craft items (Priority: P1)

A visitor browses the catalog and narrows results by category, country, or both.

**Why this priority**: Discovery is the main way visitors find relevant craft work.

**Independent Test**: Browse a catalog containing items with different categories and countries; verify each filter separately and together.

**Acceptance Scenarios**:

1. **Given** the catalog contains items, **When** a visitor opens the catalog without filters, **Then** available items are listed.
2. **Given** a visitor selects a category, **When** results load, **Then** every result belongs to that category.
3. **Given** a visitor selects a country, **When** results load, **Then** every result is from that country.
4. **Given** a visitor selects both a category and a country, **When** results load, **Then** every result matches both selections.
5. **Given** no items match the selected filters, **When** results load, **Then** the visitor sees an empty-results message and can change or clear the filters.

### User Story 3 - View a craft item (Priority: P1)

A visitor opens an item's detail page to understand what it is and who made it.

**Why this priority**: Item details provide the context needed to decide whether to contact an artisan.

**Independent Test**: Open a known item and verify its identifying information and available contact options; try an unknown item identifier.

**Acceptance Scenarios**:

1. **Given** an existing item, **When** a visitor opens its detail page, **Then** the page shows its title, description, category, country, artisan name, and any configured contact methods.
2. **Given** an item identifier that does not exist, **When** a visitor opens its detail page, **Then** a not-found outcome is shown instead of unrelated item information.

### User Story 4 - Contact an artisan by WhatsApp or email (Priority: P2)

A visitor chooses a contact method shown on an item's detail page to reach its artisan.

**Why this priority**: Direct contact turns item discovery into a conversation while relying on the artisan's configured contact details.

**Independent Test**: For an item with WhatsApp and email details, activate each contact option and verify each is addressed to the listed artisan.

**Acceptance Scenarios**:

1. **Given** an item has a WhatsApp contact, **When** a visitor chooses WhatsApp, **Then** a WhatsApp conversation is opened for the listed artisan.
2. **Given** an item has an email contact, **When** a visitor chooses email, **Then** an email composition action is opened addressed to the listed artisan.
3. **Given** an item has only one of these contact methods, **When** a visitor views its details, **Then** only the available contact action is offered.

### Edge Cases

- A filter combination matches no items.
- An item has only one supported contact method.
- An item has no valid contact method; the listing submission is rejected.
- A visitor requests an item that does not exist.
- A listing submission omits required information.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST allow an authorized creator to submit a craft item with a title, description, category, country, artisan name, and at least one valid WhatsApp or email contact.
- **FR-002**: The system MUST restrict item creation to artisan account owners.
- **FR-003**: The system MUST validate required item information and MUST NOT save an item that fails validation; it MUST identify the missing or invalid information to the creator.
- **FR-004**: A successfully created item MUST become available in catalog browsing and on its detail page.
- **FR-005**: The system MUST let visitors browse available items and filter by category, country, or both at once.
- **FR-006**: The system MUST provide the available category and country choices used by the catalog filters.
- **FR-007**: The system MUST provide a detail view for an existing item containing its title, description, category, country, artisan name, and configured contact details.
- **FR-008**: The system MUST provide a WhatsApp contact action when a valid WhatsApp contact is configured and an email contact action when a valid email address is configured.
- **FR-009**: The system MUST identify an unknown item as not found and MUST show a clear empty-results outcome when no items match the selected filters.

### API Endpoints

The following endpoint inventory describes the requested public-facing catalog and listing operations. WhatsApp and email contact use the contact details returned for an item; they do not send messages through an ArtisanLink messaging endpoint.

| Method | Endpoint              | Purpose                                                                                |
| ------ | --------------------- | -------------------------------------------------------------------------------------- |
| `GET`  | `/api/items`          | List available craft items; optional `category` and `country` filters may be combined. |
| `POST` | `/api/items`          | Create a craft item for an authenticated artisan account owner.                        |
| `GET`  | `/api/items/{itemId}` | Retrieve one item's detail and configured contact information.                         |
| `GET`  | `/api/categories`     | Retrieve category choices for browsing and filtering.                                  |
| `GET`  | `/api/countries`      | Retrieve country choices for browsing and filtering.                                   |

### Implementation Priority

| Priority | Scope                                                                      |
| -------- | -------------------------------------------------------------------------- |
| **P1**   | Add craft items; browse and filter by category/country; view item details. |
| **P2**   | Contact an artisan through the available WhatsApp or email action.         |

P1 establishes a populated, navigable catalog. P2 completes the direct-contact journey after an item can be discovered and viewed.

### Key Entities

- **Craft item**: A listing with a title, description, category, country, artisan name, and one or both contact methods.
- **Artisan**: The maker identified on a craft item and reached through its configured contact details.
- **Category**: A selectable classification used to filter craft items.
- **Country**: A selectable country value associated with a craft item and used to filter the catalog.

### Assumptions

- A newly saved item is immediately available to browse; a review or moderation workflow was not requested.
- An item must have at least one valid contact method, while either or both methods may be provided.
- The email action opens a message addressed to the artisan; no prewritten message is required.
- No price, stock, image, account-registration, or payment workflow is included because it was not requested.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of returned items match every selected category and country filter, including when both are selected.
- **SC-002**: All four specified user stories can be completed in acceptance testing using valid test data.
- **SC-003**: 100% of successfully created test items are retrievable from the catalog and by their item identifier.
- **SC-004**: For every test item with a configured WhatsApp and/or email contact, the detail page offers the corresponding action addressed to that contact; unavailable methods are not offered.
- **SC-005**: In acceptance testing, nonexistent item identifiers and filter combinations with no matches produce their specified not-found and empty-results outcomes.
