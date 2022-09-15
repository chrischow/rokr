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
First, you'll need RavenPoint, a SharePoint REST API emulator that ROKR uses as its backend. Run a RavenPoint server in a terminal window. See the [RavenPoint repo](https://github.com/chrischow/ravenpoint) for instructions on installation.

Second, in a separate terminal window, clone this repo (ROKR) to a local directory, `cd` into the `dev` folder, and install the required packages:

```bash
npm install
```

Finally, while still in the `dev` folder, launch ROKR in development mode:

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