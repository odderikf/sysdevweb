Built with React, webpack, style-loader, css-loader.

* Services model
* Components with separate stylesheets
* 


Server built with express.

* DAO model for database calls
* hosts limited segment of public directory from client

To run API and host site:

```
cd server;
npm install --only=prod
npm start
```

To build site's bundle.js:

```
cd client;
npm install --only=prod
npm run build
```

To run tests:
```
cd client;
npm install
npm test;
cd ..
cd server;
npm install
npm test;
```

Test coverage:

Server: http://odderikf.pages.stud.idi.ntnu.no/HelloWorldNews/server/
Client: http://odderikf.pages.stud.idi.ntnu.no/HelloWorldNews/client/