import fs from "fs";

class Log {
  static lastDate: string;

  static write(message: string, error: boolean | null): void {
    const d = new Date();
    const today = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    if (this.lastDate && today !== this.lastDate && fs.existsSync("log.txt")) {
      fs.renameSync("log.txt", `log-${this.lastDate}.txt`);
      this.lastDate = today;
    }
    let msg = `[${d.toISOString()}] ${error ? " ERROR - " : " INFO  - "} ${message}`
    console.log(msg);
    fs.appendFile("log.txt", `${msg}\n`, () => {});
  }

  static info(message: string): void {
    Log.write(message, false);
  }

  static error(message: string): void {
    Log.write(message, true);
  }
}

export default Log;
