import Discord from "discord.js";
import fs from "fs";
import path from "path";
import GoogleAPI from "./google";

import Log from "./log";

if (!fs.existsSync(path.resolve(__dirname, "config.json"))) {
  Log.error("Config not found");
  process.exit(1);
}

const config: Config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "config.json")).toString());

const client = new Discord.Client();
const googleapi = new GoogleAPI(config.googleapi);
googleapi.authentication();

Log.info("MASTER CONTROL PROGRAM");

client.on("ready", async () => {
  Log.info(`Logged in as ${client.user.tag}`);
  client.user.setActivity("VBRP Whitelist Apps", { type: "WATCHING" });
  const doc = await googleapi.loadSheet("1cPjVoiO3KvhjmWu_Fc86FWGxUaUYAoyCHxghne6af9A");
  Log.info(JSON.stringify(doc));
  //buildHandlers(googleapi);
});

client.login(config.discord.token);

export default googleapi;
