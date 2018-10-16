var mysql = require("mysql");

const PersonDao = require("./persondao.js");
const runsqlfile = require("./runsqlfile.js");

// GitLab CI Pool
var pool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql",
  user: "root",
  password: "secret",
  database: "supertestdb",
  debug: false,
  multipleStatements: true
});

let personDao = new PersonDao(pool);

beforeAll(done => {
  runsqlfile("dao/create_tables.sql", pool, () => {
    runsqlfile("dao/create_testdata.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test("get one person from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].navn).toBe("Hei Sveisen");
    done();
  }

  personDao.getOne(1, callback);
});

test("get unknown person from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }

  personDao.getOne(0, callback);
});

test("add person to db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  personDao.createOne(
    { navn: "Nils Nilsen", alder: 34, adresse: "Gata 3" },
    callback
  );
});

test("get all persons from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data.length=" + data.length
    );
    expect(data.length).toBeGreaterThanOrEqual(2);
    done();
  }

  personDao.getAll(callback);
});

test("update one person in db", done => {

  personDao.updateOne(1, {navn:"Hei Sveisen", alder : 21, adresse : 'Gata 2'}, (status, data) => {
      console.log(
          "Test callback: status=" + status + ", data.length=" + data.length
      );
      expect(data.affectedRows).toBe(1);
      personDao.getOne(1, (status, data) => {
          expect(data[0].alder).toBe(21);
          personDao.updateOne(1, {navn : "Hei Sveisen", alder : 22, adresse : 'Gata 2'}, (status, data) => {
              expect(data.affectedRows).toBe(1);
              done();
          })
      });
  });
});

test("delete one person in db", done=> {
    let antall = 0;
    personDao.getAll( (status, data) => {
        antall = data.length;
        personDao.deleteOne(2, (status, data) => {
            expect(data.affectedRows).toBe(1);
            personDao.getAll( (status, data) => {
                expect(data.length).toBe(antall-1);
                for(member in data){
                    expect(member.id).not.toBe(2)
                }
                done();
            });
        });
    });
});