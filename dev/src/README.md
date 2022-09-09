# ROKR Developer Guide
Read this doc for details on the app structure.

The folder structure reflects this dependency tree. Top-level components are in TitleCase. All other supporting elements are in lowercase.

In the diagrams below, each folder contains `index.js`, and sometimes, also `styles.css`. We omit these files from the diagram for simplicity.

## Top-Level Components

### 1. `Home`
This component contains the progress cards for the main organisational entity and its sub-entities. The component tree:

```
Home
└── HomeTeamCards
```

The `HomeTeamCards` component creates a list of card elements. Each card wraps a [`ProgressCard` shared component](#components), which has a progress ring for average Objective progress, and the counts of completed/total Objectives and KRs.

### 2. `Team`
This is the main component containing the bulk of components in ROKR.

```
Team
└── TeamPane
    ├── FreqDropdown
    ├── OkrSection
    │   ├── ObjectiveAdd
    │   ├── ObjectiveForm
    │   └── OkrCollapse
    │       ├── KeyResultForm
    │       ├── KeyResultRow
    │       │   ├── KeyResultEdit
    │       │   ├── KeyResultInfo
    │       │   └── QuickAddUpdate
    │       ├── ObjectiveCard
    │       │   ├── KeyResultAdd
    │       │   └── ObjectiveEdit
    │       └── ProgressBar
    └── TeamProgress
```

### 3. `Updates`

```
Updates
├── UpdateAdd
├── UpdateEdit
└── UpdatesTable
```

### 4. `Timeline`
This

### 5. `Directory`

```
Directory
├── Graph
├── SearchBar
└── useGraphSettings
```

## `shared`
This folder comprises components that are shared across 2 or more top-level components.

### Components

| Component | Purpose |
| :-------- | :------ |
| `Icons` | SVG objects in component and string constant form. Helps save memory. Used in numerous components. |
| `NavBarBrand` | Blue and green ROKR text. Has two sizes: one for NavBar, one for Home. |
| `NavBar` | Doesn't fit under any top-level component, but displays on top of every page. |
| `ProgressCard` | Progress ring with average Objective progress, and counts of completed vs. total Objectives and KRs. Used in `Home` and `Team` components. |
| `SharedModal` | Modal with configurable title, content, and closing behaviour. Controlled by state in parent component. Used in `Home` and `Updates` components. |
| `UpdateForm` | Controlled form for updates. Includes validation, submission, and a link to `DeleteForm`. Used in `Home` and `Updates` components. |
| `DeleteForm` | Form for delete entities using an `ON DELETE CASCADE` rule. Presents warning if cascading is required. Used in `Home` and `Updates` components. |

### Hooks
Data is retrieved and managed using [React Query](https://react-query-v3.tanstack.com/overview). For custom hooks are provided:

#### 1. `useObjectives`
For retrieving Objectives. There are multiple hooks:

- `useObjectives()`: Retrieves **all** Objectives in the database. It has several dependent hooks:
    - `useObjective(Id)`: Retrieves Objective with a given Id using data from `useObjectives`.
    - `useTeamObjectivesCache(team)`: Retrieves Objectives under a given team using data from `useObjectives`.
- `useObjectivesByFreq(freq)`: Retrieves Objectives with a given frequency only.
- `useTeamObjectives(team)`: Retrieves Objectives under a given team only.

#### 2. `useKeyResults`
For retrieving KRs. There are multiple hooks:

- `useKeyResults()`: Retrieves **all** KRs in the database. It has several dependent hooks:
    - `useKeyResult(Id)`: Retrieves KR with a given Id using data from `useKeyResults`.
    - `useTeamKeyResultsCache(team)`: Retrieves KRs under a given team using data from `useKeyResults`.
- `useKeyResultsByFreq(freq)`: Retrieves KRs with a given frequency only.
- `useTeamKeyResults(team)`: Retrieves KRs under a given team only.

#### 3. `useUpdates`
For retrieving Updates. There are multiple hooks:

- `useUpdates()`: Retrieves **all** Updates in the database. It has several dependent hooks:
    - `useUpdate(Id)`: Retrieves Update with a given Id using data from `useUpdates`.
    - `useKrUpdate(krId)`: Retrieves Updates under a given KR using data from `useUpdates`.
- `useKrUpdatesDirect(KrId)`: Retrieves Updates under a given KR only.
- `useTeamUpdates(team)`: Retrieves Updates under a given team only.

#### 4. `useToken`
For getting X-RequestDigest for SharePoint POST requests. Has a single `useToken` hook.


## Supporting Elements

### `assets`


### `utils`