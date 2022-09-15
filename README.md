# ROKR
RDO's solution for OKR management in RAiD.

<p>
  <img src="https://badges.aleen42.com/src/javascript.svg">
  <img src="https://badges.aleen42.com/src/react.svg">
  <img src="https://badges.aleen42.com/src/react-router.svg">
</p>

## Value Proposition
OKRs are tough to manage without tools, especially on the internal IT environment. We designed an approach (Stack 2.0) to fully leverage internal tools and designed **ROKR** as the first app built on Stack 2.0 to enable RAiD to implement OKRs.

## Installation
First, you'll need RavenPoint, a SharePoint REST API emulator that ROKR uses as its backend. See the [RavenPoint repo](https://github.com/chrischow/ravenpoint) for instructions on installation. For the creation of fake data, modify the `rokr_data_demo.py` script provided in the RavenPoint repo. Be sure to take note of the team names you used when generating the fake data.

Second, in a separate terminal window, clone this repo (ROKR) to a local directory, `cd` into the `dev` folder, and install the required packages:

```bash
git clone https://github.com/chrischow/rokr.git
cd rokr
npm install
```

Next, configure ROKR to retrieve data from the right tables. Proper configuration requires that you amend several entries in `src/config.js`:

1. List IDs: `objListId`, `krListId`, `updateListId`
2. List Item Entity Type names: `objListItemEntityTypeFullName`, `krListItemEntityTypeFullName`, `updateListItemEntityTypeFullName`
3. Teams

After creating the Objectives, Key Results, and Updates tables, enter the RavenPoint admin panel to retrieve the relevant Table IDs:

![](./docs/images/ravenpoint-tables.jpg)

The List Item Entity Type names can be retrieved via the RavenPoint Swagger UI. You will need to feed each List ID into the `/_api/web/Lists(guid'<list id here>')` endpoint:

![](./docs/images/ravenpoint-listitementitytypename.jpg)

Retrieve the `ListItemEntityTypeFullName` in the API response.

Finally, for configuration, input the team names and slugs that you used to generate the fake data. Your config file should look like this:

```js
// Config file
export const config = {
  apiUrl: 'http://127.0.0.1:5000/ravenpoint/_api/',
  objListId: '521d43a8e00c53c76ab48197784c5e41',
  krListId: 'f3ef36940ef93890c3f9d9e25fc12acc',
  updateListId: 'df7c2bf0cf2b0fda32b2998cbf8a07dc',
  objListItemEntityTypeFullName: 'SP.Data.RokrObjectivesListItem',
  krListItemEntityTypeFullName: 'SP.Data.RokrKeyResultsListItem',
  updateListItemEntityTypeFullName: 'SP.Data.RokrUpdatesListItem',
  teams: [
    { teamName: "HQ", slug: "hq" },
    { teamName: "Marketing", slug: "marketing" },
    { teamName: "HR", slug: "hr" },
    { teamName: "Finance", slug: "finance" },
    { teamName: "R&D", slug: "research-devt" },
    { teamName: "IT", slug: "it" },
  ],
  staleTime: 2 * 60 * 1000,
  tokenRefreshTime: 10 * 60 * 1000
};
```

Once all the above steps are completed, while still in the `dev` folder, launch ROKR in development mode:

```bash
npm start
```

ROKR should now be running on `http://localhost:3000/`.

## Gallery
Home page:

![](./docs/images/home-page.jpg)

Team page:

![](./docs/images/team-page.jpg)

Directory:

![](./docs/images/directory.jpg)