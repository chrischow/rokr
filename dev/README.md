# ROKR Developer Guide
This README contains details ROKR's current implementation. For ideas on future development, see [Future Development](../docs/future-dev.md).

### Table of Contents
<!-- no toc -->
- [Data](#data)
- [Architecture](#architecture)
  - [Top-Level Components](#top-level-components)
    - [1. `Home`](#1-home)
    - [2. `Team`](#2-team)
    - [3. `Updates`](#3-updates)
    - [4. `Timeline`](#4-timeline)
    - [5. `Directory`](#5-directory)
  - [`shared` Entities](#shared-entities)
    - [Components](#components)
    - [Hooks](#hooks)
      - [1. `useObjectives`](#1-useobjectives)
      - [2. `useKeyResults`](#2-usekeyresults)
      - [3. `useUpdates`](#3-useupdates)
      - [4. `useToken`](#4-usetoken)
      - [Other Information](#other-information)
  - [Supporting Elements](#supporting-elements)
    - [`assets`](#assets)
    - [`utils`](#utils)

## Data
ROKR has three main entities: (1) Objectives, (2) Key Results, and (3) Updates (on Key Results). They are stored in three separate Lists on SharePoint. See the Entity-relationship Diagram below for an overview.

```mermaid
erDiagram
  Objectives ||--|{ KeyResults : has
  KeyResults ||--|{ Updates : has
  Objectives {
    int Id PK
    string Title
    string objectiveDescription
    date objectiveStartDate
    date objectiveEndDate
    string team
    string owner
    enum frequency "annual/quarterly/monthly"
  }
  KeyResults {
    int Id PK
    string Title
    string krDescription
    date krStartDate
    date krEndDate
    int minValue
    int maxValue
    int currentValue
    int parentObjective FK "Objectives"
  }
  Updates {
    int Id PK
    string Title "Unused"
    string updateText
    date updateDate
    int parentKrId
    string team
  }
```

## Architecture
The `src` directory is set up to mimic the component dependency tree as closely as possible. Top-level components are in folders in TitleCase, while folders for all other supporting elements are in lowercase.

In the diagrams below, each folder contains `index.js`, and sometimes, also `styles.css`. We omit these files from the diagram for simplicity. Cells in purple are shared components.

```mermaid
graph LR
  %% Top-level components
  Root --> Home
  Root --> Team
  Root --> Updates
  Root --> Timeline
  Root --> Directory
  
  %%Directory
  Directory --> Graph
  Directory --> Searchbar
  Directory --> UGS["useGraphSettings<br>(hook)"]

  %% Home
  Home --> HomeTeamCards
  Home --> PC([ProgressCard])
  HomeTeamCards --> PC

  %% Team
  Team --> TeamPane
  TeamPane --> TeamProgress
  TeamPane --> OkrSection
  TeamPane --> FreqDropdown

  TeamProgress --> PC

  OkrSection --> ObjectiveAdd
  OkrSection --> OkrCollapse
  OkrSection --> SM([SharedModal])
  ObjectiveAdd --> OF([ObjectiveForm])

  OkrCollapse --> KeyResultRow
  OkrCollapse --> ObjectiveCard

  ObjectiveCard --> SM
  ObjectiveCard --> PB([ProgressBar])
  ObjectiveCard --> ObjectiveEdit
  ObjectiveCard --> KeyResultAdd
  ObjectiveCard --> DF([DeleteForm])

  ObjectiveEdit --> OF
  KeyResultAdd --> KRF([KeyResultForm])

  KeyResultRow --> PB
  KeyResultRow --> SM
  KeyResultRow --> KeyResultInfo
  KeyResultRow --> KeyResultEdit
  KeyResultRow --> DF

  KeyResultEdit --> KRF
  KeyResultInfo --> QuickAddUpdate
  QuickAddUpdate --> UF([UpdateForm])

  Updates --> SM
  Updates --> UpdatesTable
  Updates --> UpdatesAdd
  Updates --> UpdatesEdit
  Updates --> DF

  UpdatesAdd --> UF
  UpdatesEdit --> UF

  classDef shared fill:#7b73f0,color:white
  class PC,SM,DF,UF,OF,KRF,PB shared
```

### Top-Level Components

#### 1. `Home`
This component contains the progress cards for the main organisational entity and its sub-entities. The component tree:

```mermaid
graph LR
  %% Home
  Home --> HomeTeamCards
  Home --> PC([ProgressCard])
  HomeTeamCards --> PC

  classDef shared fill:#7b73f0,color:white
  class PC,SM,DF,UF,OF,KRF,PB shared
```

| Component | Purpose |
| :-------- | :------ |
| `Home` | Contains an overall `ProgressCard` [shared component](#components), and a bunch of cards, one per non-HQ team. |
| `HomeTeamCards` | Contains a list of card elements. Each card wraps has a team name and a `ProgressCard`. |


#### 2. `Team`
This is the main component containing the bulk of components in ROKR. For ease of viewing, the explanations for the components are split into two tables. Refer to the [`shared`](#components) section for more info on shared components (purple).

| Component | Purpose |
| :-------- | :------ |
| `Team` | Contains three Tab panels, one for each frequency (monthly, quarterly, annual). Each panel contains a `TeamPane`. Queries the team's Objectives, KRs, and Updates and passes it into each (Bootstrap) Tab panel. |
| `TeamPane` | Contains the Tabs for staff (monthly frequency only), and a time period selector (`FreqDropdown`). Filters the data provided in props using the chosen staff and period, and passes the data down to the child components. |
| `FreqDropdown` | Dynamic dropdown menu for monthly, quarterly, or annual time periods in the dataset. |
| `TeamProgress` | Basically a `ProgressCard` shared component, the same one on the top of the `Home` page. |
| `OkrSection` | Joins the data to create `OkrCollapse` components. Handles the creation of Objectives through a `SharedModal` shared component. Auto-populates new Objective forms with the currently selected team, frequency, time period, and staff (if applicable). |
| `ObjectiveAdd` | Wrapper for `ObjectiveForm` to render it in add mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |

```mermaid
graph LR
  %% Team
  Team --> TeamPane
  TeamPane --> FreqDropdown
  TeamPane --> TeamProgress
  TeamPane --> OkrSection

  TeamProgress --> PC([ProgressCard])

  OkrSection --> ObjectiveAdd
  OkrSection --> OkrCollapse
  OkrSection --> SM([SharedModal])
  ObjectiveAdd --> OF([ObjectiveForm])

  OkrCollapse --> KeyResultRow
  OkrCollapse --> ObjectiveCard

  ObjectiveCard --> SM
  ObjectiveCard --> PB([ProgressBar])
  ObjectiveCard --> ObjectiveEdit
  ObjectiveCard --> KeyResultAdd
  ObjectiveCard --> DF([DeleteForm])

  ObjectiveEdit --> OF
  KeyResultAdd --> KRF([KeyResultForm])

  KeyResultRow --> PB
  KeyResultRow --> SM
  KeyResultRow --> KeyResultInfo
  KeyResultRow --> KeyResultEdit
  KeyResultRow --> DF

  KeyResultEdit --> KRF
  KeyResultInfo --> QuickAddUpdate
  QuickAddUpdate --> UF([UpdateForm])

  classDef shared fill:#7b73f0,color:white
  class PC,SM,DF,UF,OF,KRF,PB shared
```

| Component | Purpose |
| :-------- | :------ |
| `OkrCollapse` | Wraps one `ObjectiveCard` and several `KeyResultRow`s. |
| `ObjectiveCard` | Displays Objective info through text and a `ProgressBar`. Handles the editing & deleting of Objectives and adding of KRs through `SharedModal`s. Auto-populates new KR forms with current Objective and selected time period. |
| `KeyResultRow` | Displays KR info through text and a `ProgressBar`. Handles the viewing, editing, and deleting of KRs through `SharedModal`s. |
| `ObjectiveEdit` | Wrapper for `ObjectiveForm` to render it in edit mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |
| `KeyResultAdd` | Wrapper for `KeyResultForm` to render it in add mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |
| `KeyResultEdit` | Wrapper for `KeyResultForm` to render it in edit mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |
| `KeyResultInfo` | Displays detailed KR info and lists Updates in a DataTable. Also links to the associated `Updates` view (top-level component), and contains a form to quickly add updates. |
| `QuickAddUpdate` | Wrapper for `UpdateForm` to render it in add mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |

#### 3. `Updates`

```mermaid
graph TD
  Updates --> SM([SharedModal])
  Updates --> UpdatesAdd
  Updates --> UpdatesEdit
  Updates --> DF([DeleteForm])
  Updates --> UpdatesTable

  UpdatesAdd --> UF([UpdateForm])
  UpdatesEdit --> UF

  classDef shared fill:#7b73f0,color:white
  class PC,SM,DF,UF,OF,KRF,PB shared
```

| Component | Purpose |
| :-------- | :------ |
| `Updates` | Manages the data and holds the states for the add and edit forms for Updates of a given KR. |
| `UpdateAdd` | Wrapper for `UpdateForm` to render it in add mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |
| `UpdateEdit` | Wrapper for `UpdateForm` to render it in edit mode. Defines functions to (1) invalidate and refetch data, and (2) clean up the form. |
| `UpdatesTable` | DataTable for displaying Updates. Contains buttons to edit each Update. |

#### 4. `Timeline`
Contains a single DataTable comprising all Updates. It pulls all Objectives, Key Results, and Updates - this can be improved.

#### 5. `Directory`
In addition to the components below, the main `Directory` component has a panel to display OKR information.

```mermaid
graph TD
  %%Directory
  Directory --> Graph
  Directory --> Searchbar
  Directory --> UGS["useGraphSettings (hook)"]
```

| Component | Purpose |
| :-------- | :------ |
| `SearchBar` | Search bar for user to search for OKRs, which will be highlighted in the `Graph`. |
| `Graph` | An interactive network graph for displaying OKRs. |
| `useGraphSettings` | Hook to generate graph settings. |

### `shared` Entities
This folder comprises components that are shared across 2 or more components. Any reference to another component will always go to the `shared` folder.

#### Components

| Component | Purpose |
| :-------- | :------ |
| `Icons` | SVG objects in component and string constant form. Helps save memory. Used in numerous components. |
| `NavBarBrand` | Blue and green ROKR text. Has two sizes: one for NavBar, one for Home. |
| `NavBar` | Doesn't fit under any top-level component, but displays on top of every page. |
| `ProgressCard` | Progress ring with average Objective progress, and counts of completed vs. total Objectives and KRs. Used in `Home` and `Team` components. |
| `SharedModal` | Modal with configurable title, content, and closing behaviour. Controlled by state in parent component. Used in `Home` and `Updates` components. |
| `ProgressBar` | Has two variants: one for Objectives and one for KRs. |
| `ObjectiveForm` | Controlled form for adding and editing Objectives. Includes validation, submission, and a link to `DeleteForm`. Component is held at this level because it is used in multiple components within `Team`: (1) `ObjectiveAdd` and (2) `ObjectiveEdit`. |
| `KeyResultForm` | Controlled form for adding and editing Key Results. Includes validation, submission, and a link to `DeleteForm`. Component is held at this level because it is used in multiple components within `Team`: (1) `KeyResultAdd` and (2) `KeyResultEdit`. |
| `UpdateForm` | Controlled form for adding and editing Updates. Includes validation, submission, and a link to `DeleteForm`. Used in `Home` and `Updates` components. |
| `DeleteForm` | Form for delete entities using an `ON DELETE CASCADE` rule. Presents warning if cascading is required. Used in `Home` and `Updates` components. |

#### Hooks
Data is retrieved and managed using [React Query](https://react-query-v3.tanstack.com/overview).

| Hook(s) | Usage |
| :------ | :---- |
| `useObjectives`, `useKeyResults`, `useUpdates` | Retrieve all data for `Timeline`. |
| `useObjectivesByFreq('annual')`, `useObjectivesByFreq('annual')` | Retrieve annual data for `Home` and `Directory`. |
| `useTeamObjectives(<team>)`, `useTeamKeyResults(<team>)`, `useTeamUpdates(<team>)` | Retrieve team data for `Team`. |
| `useKeyResult(<krId>)`, `useKrUpdatesDirect(<krId>)` | Retrieve info on a KR and its associated Updates for `Updates`. |

##### 1. `useObjectives`
For retrieving Objectives. There are multiple hooks:

- `useObjectives()`: Retrieves **all** Objectives in the database. It has several dependant hooks:
    - `useObjective(Id)`: Retrieves Objective with a given Id using data from `useObjectives`.
    - `useTeamObjectivesCache(team)`: Retrieves Objectives under a given team using data from `useObjectives`.
- `useObjectivesByFreq(freq)`: Retrieves Objectives with a given frequency only.
- `useTeamObjectives(team)`: Retrieves Objectives under a given team only.

##### 2. `useKeyResults`
For retrieving KRs. There are multiple hooks:

- `useKeyResults()`: Retrieves **all** KRs in the database. It has several dependant hooks:
    - `useKeyResult(Id)`: Retrieves KR with a given Id using data from `useKeyResults`.
    - `useTeamKeyResultsCache(team)`: Retrieves KRs under a given team using data from `useKeyResults`.
- `useKeyResultsByFreq(freq)`: Retrieves KRs with a given frequency only.
- `useTeamKeyResults(team)`: Retrieves KRs under a given team only.

##### 3. `useUpdates`
For retrieving Updates. There are multiple hooks:

- `useUpdates()`: Retrieves **all** Updates in the database. It has several dependant hooks:
    - `useUpdate(Id)`: Retrieves Update with a given Id using data from `useUpdates`.
    - `useKrUpdate(krId)`: Retrieves Updates under a given KR using data from `useUpdates`.
- `useKrUpdatesDirect(KrId)`: Retrieves Updates under a given KR only.
- `useTeamUpdates(team)`: Retrieves Updates under a given team only.

##### 4. `useToken`
For getting X-RequestDigest for SharePoint POST requests. Has a single `useToken` hook.

##### Other Information
React Query is configured with the following settings in `config.js`:

- `staleTime = Infinity`: Under this scheme, the data is always fresh, and *automatic* refetching is completely disabled. The data will only be refreshed when the user hits the refresh buttons or refreshes the page entirely. This is to prevent automatic refetching from disrupting edits in progress.
- `tokenRefreshTime = 25 minutes`: This setting is the `staleTime` for the `useToken` hook, which queries SharePoint for a Request Digest (token) and caches it.
  - With this setting, the token is cached for 25 minutes, which is just under the token validity of 30 minutes. This reduces an excessive queries to the server for tokens, while keeping within the validity period.
  - Fetching of the token only occurs when a component with the `useToken` hook (`ObjectiveForm`, `KeyResultForm`, `UpdateForm`, or `QuickAddUpdate`) is rendered **AND** the old token has been around for 25 minutes and is therefore stale, **AND** when any of the default refetch criteria are met, as stated in the [React Query documentation](https://tanstack.com/query/v4/docs/guides/important-defaults) (see bullets below). Note that refetching the token **will not result in lost edits**.
    - New instances of the query mount
    - The window is refocused
    - The network is reconnected

### Supporting Elements

#### `assets`
For images, video, audio, and anything other non-code element used in the app.

#### `utils`

| Utility | Usage |
| :------ | :---- |
| `circleProgress` | For drawing progress rings. |
| `dataProcessing` | Currently only one data processing function: `sortByTitle` for sorting Objectives and Key Results. |
| `dates` | For formatting dates, and converting dates between time periods (WY, quarter, month). |
| `query` | Query constructors that are used in React Query hooks. |
| `stats` | For generating aggregate metrics. |
| `validators` | Validators for `ObjectiveForm`, `KeyResultForm`, and `UpdateForm`. |
