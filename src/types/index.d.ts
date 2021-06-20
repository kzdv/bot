declare namespace NodeJS {
  export interface Global {
    __version: string;
    __basedir: string;
  }
}

declare interface Config {
  discord: {
    token: string;
  };
  database: DBConfig;
}

declare interface DiscordLink {
  type: string;
  license: string;
  discord: string;
}

declare interface SMConfig {
  ip: string;
  port: number;
  restartTimes: number[];
  restartCmd: string;
}

declare interface roleCache {
  [key: string]: string
}

declare interface ApplicationConfig {
  type: string;
  docId: string;
  sheetId: string;
  announce: {
    column: number;
    values: { [key: string]: string } | string;
  };
}

declare interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

declare interface RconConfig {
  host: string;
  port: number;
  password: string;
}

declare interface ApplicationData {
  docid: string;
  name: string;
  channel: string;
  applications: { [key: string]: string }[];
}

declare namespace Command {
  interface Options {
    command: string;
    alias?: string;
    description: string;
    roles: string[];
  }
}