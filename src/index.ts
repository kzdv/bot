import Discord from "discord.js";
import fs from "fs";
import path from "path";
import ApplicationHandler from "./lib/ApplicationHandler";
import GoogleAPI from "./lib/GoogleAPI";
import Log from "./lib/Log";
import Client from "./lib/Client";
import ServerMonitor from "./lib/ServerMonitor";

if (!fs.existsSync(path.resolve("config.json"))) {
  Log.error("Config not found");
  process.exit(1);
}

global.__version = "1.1.1";
global.__basedir = __dirname;

const config: Config = JSON.parse(fs.readFileSync(path.resolve("config.json")).toString());

const client = new Client();
const googleapi = new GoogleAPI(config.googleapi);
let guild: Discord.Guild;
googleapi.authentication();
const applicationhanders = {};
const servermonitors: ServerMonitor[] = [];

Log.info(`MASTER CONTROL PROGRAM ${global.__version}`);

client.on("ready", async () => {
  Log.info(`Logged in as ${client.user.tag}`);
  client.user.setActivity("VBRP Whitelist Apps", { type: "WATCHING" });
  guild = client.guilds.cache.first();
  config.applications.forEach((v) => {
    applicationhanders[v.type] = new ApplicationHandler(v);
  });

  Log.info("Configuring server monitors");
  config.serverMonitor.forEach((v) => {
    servermonitors.push(new ServerMonitor(v));
    Log.info(`Registered server monitor for ${v.ip}:${v.port}`);
  });
});

client.loadEvents("./events");
client.loadCommands("./commands");
client.loadDatabase(config.database);
client.setRconConfig(config.rcon);

client.login(config.discord.token);

export { googleapi, guild };
