import mysql from "mysql";
import fs from "fs";

export function run_mysql(filename: string, pool: mysql.Pool, done) {
    let sql = fs.readFileSync(filename, "utf8");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("runsqlfile: error connecting");
            console.log(err);
            done();
        } else {
            connection.query(sql, (err, rows) => {
                connection.release();
                if (err) {
                    console.log(err);
                    done();
                } else {
                    done();
                }
            });
        }
    });
}
