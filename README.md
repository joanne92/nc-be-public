## Northcoders News API

A heroku app to give you the latest Northcoders News

https://jo-nc-news.herokuapp.com/

### Getting Started

To use the northocders news api fork and clone this repo to your computer.

### Prerequisites

```
Node.js
```

### Installing

To run this on your local host create a config folder, with an index.js inside it.
Inside your index.js file, create a config object like this example:

```
const config = {
dev: {
DB_URL: "mongodb://localhost:27017/<database_name>",
PORT: 9090,
COMMENTS: 500
}
};
```

This will seed your database when running this command:

```
npm run seed:dev
```

### Using on your local host

Now your database is seeded, run

```
npm run dev
```

This will connect to your local host.

In your browser you can use Northcoders News endpoints to view the data in your database

For example

```
api/topics
```

This will give you all the topics in northcoder news on your browser

### Running the Tests

Add this object inside your config object in config/index.js

```
test: {
DB_URL: "mongodb://localhost:27017/<database_name_test>",
PORT: 3000,
COMMENTS: 5
}
```

Run the command

```
npm run seed:test
```

this will seed your test database

Now run:

```
npm run test
```

This command will run the tests for this repo.
Each test tests that each endpointng responds with the correct data.

### Deployment

To deploy the nc app to heroku you will first need to create an mlab account,
create a new database, and a new user for that database.

Make a production object like this expample inside your config object

```
    production: {
    DB_URL: "mongodb://<mlab_username>:<mlab_password>.mlab.com:27469/<database_name>",
    COMMENTS: 500,
    USERNAME: username,
    PASSWORD: pasword
}
```

Copy and paste the mlab url from your mlab database into your producton object.

Run the command

```
npm run seed:production
```

This will seed your mlab database with the northcoder news data

Create heroku account

In the commandline, cd into your repo and type

```
heroku create nc-news
```

In your heroku account click on verify config
Enter your mlab DB_URL into youir verfig config

Back in the command line type

```
heroku open .
```

to view your northocders news app on heroku
