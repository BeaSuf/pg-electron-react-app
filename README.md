<p align="center">
  <img src="https://cdn.rawgit.com/alexdevero/electron-react-webpack-boilerplate/master/docs/images/electron-react-webpack-boilerplate.png" width="135" align="center">
  <br>
  <br>
</p>

<p align="center">
  <a href="https://david-dm.org/alexdevero/electron-react-webpack-boilerplate">Based on Minimal Electron, React and Webpack boilerplate (by DEVERO)</a>
</p>

## PG client - Electron, React, Material UI app 

GUI client for PostgreSQL DB - to get visual representation of the DB tables and columns.

To help users that are new to use SQL queries. Left side of the screen lists the tables of the DB. Selecting a table from that list will generate a "SELECT" SQL query for this table in the Query area. Expanding the table(s) (by clicking on arrow down) will list the columns of the table and they will be added to the SQL query in the Query area. Checking/Unchecking the column(s) will amend the SQL query.
To execute the SQL query, press on "Execute" button.
To copy the SQL query to the clipboard, press on "Copy to Clipboard" button. 
The SQL query can be amended manualy as well as writen from scratch. 
Executing the query will either produce a result set or an error in case of erroneous SQL query.

### Table of contents

* [Install](#install)
* [Usage](#usage)

### Install

#### Clone this repo

```
git clone 
```

#### Install dependencies

```
npm install
```
or
```
yarn
```

### Usage

#### Run the app

```
npm start
```
or
```
yarn start
```

#### Build the app (automatic)

```
npm run package
```
or
```
yarn package
```

#### Build the app (manual)

```
npm run build
```
or
```
yarn build
```

#### Test the app (after `npm run build` || `yarn run build`)
```
npm run prod
```
```
yarn prod
```

