import Discord from "discord.js";
import fs from "fs";
import path from "path";
import ApplicationHandler from "./lib/ApplicationHandler";
import GoogleAPI from "./lib/GoogleAPI";
import Log from "./lib/Log";

if (!fs.existsSync(path.resolve("config.json"))) {
  Log.error("Config not found");
  process.exit(1);
}

const config: Config = JSON.parse(fs.readFileSync(path.resolve("config.json")).toString());

const client = new Discord.Client();
const googleapi = new GoogleAPI(config.googleapi);
let guild: Discord.Guild;
googleapi.authentication();
const applicationhanders = {};

Log.info("MASTER CONTROL PROGRAM");

client.on("ready", async () => {
  Log.info(`Logged in as ${client.user.tag}`);
  client.user.setActivity("VBRP Whitelist Apps", { type: "WATCHING" });
  guild = client.guilds.cache.first();
  config.applications.forEach((v) => {
    applicationhanders[v.type] = new ApplicationHandler(v);
  });
});

client.on("message", (message) => {
  if (!message.content || message.author.bot) {
    return;
  }
});

client.login(config.discord.token);

export { googleapi, guild };
