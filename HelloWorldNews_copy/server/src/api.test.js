// @flow
import mysql from "mysql"
import {run_mysql} from "./run_mysql";
import fetch from "node-fetch"
import {create_app} from "./index"
import config from "../config"

let app, server, pool, socketMap;

beforeAll( done => {
    pool = mysql.createPool(config.test_mysql_props);
    app = create_app(pool);
    server = app.listen(9001);

    let lastSocketKey = 0;
    socketMap = {};
    server.on('connection', (socket) => {
        // generate a new, unique socket-key
        let socketKey = ++lastSocketKey;
        // add socket when it is connected
        socketMap[socketKey] = socket;
        socket.on('close', () => {
            // remove socket when it is closed
            delete socketMap[socketKey];
        });
    });
    done();

});

afterAll( async done => {
    server.close( async ()=>{
        let promises = Object.keys(socketMap).map((key) => {
            return new Promise(async (resolve) => {
                socketMap[key].on('close', resolve);
                socketMap[key].destroy();
            })
        });
        await Promise.all(promises);
        pool.end();
        done()
    });
});

beforeEach( done => {
    run_mysql("../mysql_setup/setup.sql", pool, () => {
        run_mysql("../mysql_setup/data_test.sql", pool, () => {
            done();
        });
    })
});

let fetch_json = {
    method: "GET",
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    timezone: 'utc+2'
};

async function fetchTest(address:string, expected:Array<Object>, done=null){
    let response = await fetch(address, fetch_json);
    let json = await response.json();
    expect(json.length).toEqual(expected.length);
    if(response.ok) {
        expected.forEach( (ex,i) => {
            let ac = json[i];
            Object.keys(ex).forEach( key => {
                if (key === "created"){
                    expect(Date.parse(ac[key])).toEqual(Date.parse(ex[key]));
                } else {
                    expect(ac[key]).toEqual(ex[key]);
                }
            })
        });
        expect(json).toEqual(expected);
    }
    else
        throw Error(response.statusText);
    if (done) return done();
}

// gets:

test("Get articles from database", async done => {
    let json1 = await (await fetch("http://localhost:9001/api/articles", fetch_json)).json();
    expect(json1.length).toEqual(10);
    let json2 = await (await fetch("http://localhost:9001/api/articles?page=1")).json();
    expect(json2.length).toEqual(1);
    let art1 = json1[0];
    expect(art1.title).not.toBeNull();
    expect(art1.content).not.toBeNull();
    expect(art1.created).not.toBeNull();
    let art2 = json2[0];
    expect(art2.title).not.toBeNull();
    expect(art2.content).not.toBeNull();
    expect(art2.created).not.toBeNull();

    done()
});

test("Get important articles from database", async done => {
    let json = await (await fetch("http://localhost:9001/api/articles/important")).json();
    json.map(e => {
        expect(e.title).not.toBeNull();
    });

    done();
});

test("Get category", async done => fetchTest("http://localhost:9001/api/articles?category=java",
    [{"id_article":5,"title":"test2","created":"2018-09-05T08:00:00.000Z","image":"ingen","category":"java","upvotes":5},{"id_article":2,"title":"test","created":"2018-09-05T08:00:00.000Z","image":"ingen","category":"java","upvotes":1},{"id_article":11,"title":"test2","created":"2018-08-30T22:00:00.000Z","image":"ingen","category":"java","upvotes":10000},{"id_article":4,"title":"test2","created":"2018-08-31T22:00:00.000Z","image":"ingen","category":"java","upvotes":500},{"id_article":10,"title":"test2","created":"2018-08-30T22:00:00.000Z","image":"ingen","category":"java","upvotes":2000},{"id_article":1,"title":"test","created":"2018-08-31T22:00:00.000Z","image":"ingen","category":"java","upvotes":1},{"id_article":8,"title":"test2","created":"2018-08-05T08:00:00.000Z","image":"ingen","category":"java","upvotes":5000},{"id_article":7,"title":"test2","created":"2018-07-31T22:00:00.000Z","image":"ingen","category":"java","upvotes":5000}],
    done));

test("Get article", async done => {
    await fetchTest("http://localhost:9001/api/articles/1",
        [{"id_article":1,"title":"test","created":"2018-08-31T22:00:00.000Z","content":"testest","image":"ingen","category":"java","upvotes":1,"important":1}]
    );
    await fetchTest("http://localhost:9001/api/articles/2",
        [{"id_article":2,"title":"test","created":"2018-09-05T08:00:00.000Z","content":"testest","image":"ingen","category":"java","upvotes":1,"important":1}]
    );
    await fetchTest("http://localhost:9001/api/articles/3",
        [{"id_article":3,"title":"test","created":"2018-09-05T09:00:00.000Z","content":"testest","image":"ingen","category":"js","upvotes":1,"important":1}]
    );
    done();
});

test("Get article comments", async done => fetchTest("http://localhost:9001/api/articles/1/comments",
    [{"content": "Ho ho ho", "id_comment": 1, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 2, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 3, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 4, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 5, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 6, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 7, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 8, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 9, "nick": "Nicholas"},{"content": "Ho ho ho", "id_comment": 10, "nick": "Nicholas"}],
        done));

test("Get article comments page 1", async done => fetchTest("http://localhost:9001/api/articles/1/comments/1",
    [{"content": "Ho ho ho", "id_comment": 11, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 12, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 13, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 14, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 15, "nick": "Nicholas"}, {"content": "Ho ho ho", "id_comment": 16, "nick": "Nicholas"}, {"content": "Hee Hee Hoo", "id_comment": 17, "nick": "Doc Scratch"}, {"content": "Hee Hee Hoo", "id_comment": 18, "nick": "Doc Scratch"}, {"content": "Hee Hee Hoo", "id_comment": 19, "nick": "Doc Scratch"}, {"content": "Hee Hee Hoo", "id_comment": 20, "nick": "Doc Scratch"}],
    done));

// puts:

test("Put article 4", async done => {
    let old = await (await fetch("http://localhost:9001/api/articles/4", fetch_json)).json();
    old = old[0];
    let old_title = old.title;
    let new_title = old.title = "Edited by npm test";
    expect(new_title).not.toEqual(old_title);
    await fetch("http://localhost:9001/api/articles/4", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(old),
        timezone: 'utc+2'
    });

    let neww = await (await fetch("http://localhost:9001/api/articles/4", fetch_json)).json();
    neww = neww[0];

    expect(neww.title).toEqual(new_title);

    done();
});

test("Upvote article 1", async done => {
    let old = await (await fetch("http://localhost:9001/api/articles/1", fetch_json)).json();
    old = old[0];
    let old_upvotes = old.upvotes;
    let new_upvotes = old.upvotes = old_upvotes+1;

    await fetch("http://localhost:9001/api/articles/1/upvote", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        timezone: 'utc+2'
    });
    let neww = await (await fetch("http://localhost:9001/api/articles/1", fetch_json)).json();
    neww = neww[0];

    expect(neww.upvotes).toEqual(new_upvotes);
    done();
});

// posts:

test("post comment on article 10", async done => {
    let old_comments = await (await fetch("http://localhost:9001/api/articles/10/comments", fetch_json)).json();
    expect(old_comments.length).toEqual(0);
    let comment = {
        nick: "Jest",
        id_comment: 25,
        content: "Comment made by Jest"
    };
    await fetch("http://localhost:9001/api/articles/10/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(comment),
        timezone: 'utc+2'
    });
    let comments = await (await fetch("http://localhost:9001/api/articles/10/comments", fetch_json)).json();
    expect(comments.length).toEqual(1);
    let new_comment = comments[0];
    expect(new_comment).toEqual(comment);

    done();
});

test("post new article", async done => {
    let article = {
       title: "Article made by Jest",
       content: "Jest made this article. This is a great article. Lorem ipsum whatever dolor amit sensei senpai san sama kun",
       image: "Ingen",
       category: "java",
       important: 0,
       created: "2018-08-31 16:02:07"
    };
    await fetch("http://localhost:9001/api/articles/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(article),
        timezone: config.test_mysql_props.timezone
    });

    let all_articles:Array<Object> = await (await fetch("http://localhost:9001/api/articles", fetch_json)).json();
    expect(all_articles.length).toBeGreaterThan(0);
    let new_article_list: Array<Object> = all_articles.filter(a=>a.title===article.title);
    expect(new_article_list.length).toEqual(1);
    let new_article: Object = new_article_list[0];
    new_article = await (await fetch("http://localhost:9001/api/articles/"+new_article.id_article)).json();
    new_article = new_article[0];
    Object.keys(article).forEach(key => {
        if (key !== "created")
            expect(new_article[key]).toEqual(article[key]);
        // else: check dates, but js Dates are gross and incompatible with mysql dates so let's not. Timezone errors :/
    });
    done();
});

// deletes:

test("delete article 7", async done => {
   await fetch("http://localhost:9001/api/articles/7", {
       method: "DELETE",
       headers: {
           "Content-Type": "application/json; charset=utf-8"
       },
       timezone: 'utc+2'
   });
   let all_articles = await (await fetch("http://localhost:9001/api/articles", fetch_json)).json();
   let art7 = all_articles.filter(a => a.id_article === 7);
   expect(art7.length).toEqual(0);
   done();

});

test("get article count", async done => fetchTest("http://localhost:9001/api/articlecount",
    [{count: 11}],
    done)
);

test("get comment count for article 1", async done => fetchTest("http://localhost:9001/api/articles/1/commentcount",
    [{count: 24}],
    done));

test("get important article count", async done => fetchTest("http://localhost:9001/api/importantarticlecount",
    [{count: 10}],
    done));

test("check index.html exists", async done => {
    let page = await (await fetch("http://localhost:9001/")).text();
    expect(page).toContain('<div id="root"');
    done()
});

test("check image fetching works", async done => {
    let img1 = await fetch("http://localhost:9001/livefeed.png");
    expect(img1.status).toBe(200);
    let img2 = await fetch("http://localhost:9001/article_images/default_cpp.png");
    expect(img2.status).toBe(200);

    let asText = await img1.text();
    expect(asText).toContain("PNG");
    expect(asText).not.toContain("<body");
    done();
});

test("garbage urls give index", async done => {
    let page = await (await fetch("http://localhost:9001/idkkaoijjdiua/dakdiodawmkfjiawjdiawj/adklmwaijdjaw&ad=2214214")).text();
    expect(page).toContain('<div id="root"');

    done();
});