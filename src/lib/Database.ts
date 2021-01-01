import mysql2 from "mysql2";
import Log from "./Log";

export default class Database {
  pool: mysql2.Pool;

  constructor(config: DBConfig) {
    this.buildPool(config);
  }

  buildPool(config: DBConfig): void {
    try {
      this.pool = mysql2.createPool({
        host: config.host || "localhost",
        port: config.port || 3306,
        user: config.username || "root",
        password: config.password || "",
        database: config.database || "vbrp",
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
      });
    } catch(err) {
      Log.error(`Error creating database pool: ${err}`);
      console.trace();
      process.exit(1);
    }
  }

  getPool(): mysql2.Pool {
    return this.pool;
  }
}