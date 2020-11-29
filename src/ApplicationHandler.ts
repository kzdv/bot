import googleapi from "./index";

class ApplicationHandler {
  config: Config["applications"];
  intTimer: NodeJS.Timer;

  constructor(config) {
    this.config = config;
  }
  
}

export default ApplicationHandler;
