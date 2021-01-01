declare namespace NodeJS {
  export interface Global {
    __version: string;
    __basedir: string;
  }
}

declare interface Config {
  discord: {
    token: string;
    commandChanne: string;
  };
  applications: ApplicationConfig[];
  database: DBConfig;
  rcon: RconConfig;
  googleapi: {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
  };
  serverMonitor: SMConfig[];
}

declare interface SMConfig {
  ip: string;
  port: number;
  restartTimes: number[];
  restartCmd: string;
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