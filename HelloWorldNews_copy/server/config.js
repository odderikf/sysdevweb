// @flow

// DO NOT edit directly unless you are developing, this is the *default* file
// create a file called "config.mine.js" to overwrite properties in this file,
// example:
/* config.mine.js:
export default {
    test_mysql_props: {
        host: "localhost",
        user: "test",
        password: "",
    }
};
 */

import mine from "./config.mine"
export default {
    test_mysql_props: Object.assign(
        {
            connectionLimit: 1,
            host: "mysql",
            user: "root",
            password: "HelloWorldNewsRoot",
            database: "HelloWorldNewsTest",
            debug: false,
            multipleStatements: true,
            timezone: 'utc+2'
        },
        mine.test_mysql_props
    ),
    mysql_props: Object.assign(
        {
            connectionLimit: 3,
            host: "localhost",
            user: "browser",
            password: "",
            database: "HelloWorldNews",
            debug: false
        },
        mine.mysql_props
    ),
    api_props: Object.assign(
        {
            port: 8080
        },
        mine.api_props
    ),

    client_props: Object.assign(
        {
            public: "client/public/"
        },
        mine.client_props
    ),
}

