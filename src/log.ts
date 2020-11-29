class Log {
  static write(message: string, error: boolean | null): void {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${error ? " ERROR - " : " INFO  - "} ${message}`);
  }

  static info(message: string): void {
    Log.write(message, false);
  }

  static error(message: string): void {
    Log.write(message, true);
  }
}

export default Log;
