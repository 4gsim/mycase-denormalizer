const r = require("rethinkdb");

const repository = Repository();

function Repository() {
  let connection;

  return {
    insert,
    replace,
  };

  async function init() {
    connection =
      connection ||
      (await new Promise((resolve, reject) => {
        r.connect(
          {
            host: "rethinkdb",
            port: 28015,
            db: "cases",
          },
          (err, conn) => {
            if (err) return reject(err);
            resolve(conn);
          }
        );
      }));
  }

  async function insert(table, data) {
    await init();
    
    return new Promise((resolve, reject) => {
      r.table(table)
        .insert(data)
        .run(connection, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
    });
  }

  async function replace(table, data) {
    await init();

    return new Promise((resolve, reject) => {
      r.table(table)
        .get(data.executionId)
        .replace(data)
        .run(connection, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
    });
  }
}

module.exports = repository;
