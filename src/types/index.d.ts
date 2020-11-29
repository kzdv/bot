declare interface Config {
  discord: {
    token: string;
  };
  applications: {
    type: string;
    docId: string;
    sheetId: string;
    announce: {
      column: number;
      values: { [key: string]: string };
    };
  }[];
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
}

declare interface ApplicationData {
  docid: string;
  name: string;
  channel: string;
  applications: { [key: string]: string }[];
}
