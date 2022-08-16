import Discord, { Intents } from "discord.js";
import fs from "fs";
import path from "path";
import Log from "./lib/Log";
import Client from "./lib/Client";
import cron from "node-cron";
import axios from "axios";
import Utils from "./lib/Utils";

if (!fs.existsSync(path.resolve("config.json"))) {
  Log.error("Config not found");
  process.exit(1);
}

global.__version = "1.2.0";
global.__basedir = __dirname;

const config: Config = JSON.parse(fs.readFileSync(path.resolve("config.json")).toString());

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: [
    'CHANNEL',
  ],
});
client.githubToken = config.github.token;
let guild: Discord.Guild;
Log.info(`MASTER CONTROL PROGRAM ${global.__version}`);

client.on("ready", async () => {
  Log.info(`Logged in as ${client.user.tag}`);
  client.user.setActivity("Falcon", { type: "WATCHING" });
  guild = client.guilds.cache.first();
  guild.me.setNickname("Master Control Program");
  await guild.roles.fetch();
  const roles = [
    "Home Controller",
    "Visiting Controller",
    "ZDV Guest",
    "Administrator",
    "Supervisor",
    "Instructor 3",
    "Instructor 1",
    "Controller 3",
    "Controller 1",
    "Student 3",
    "Student 2",
    "Student 1",
    "Observer",
  ];
  // Roles to ignore name settings
  const rolesToIgnore = ["bot-ignore"];
  let rc: roleCache = {};

  roles.forEach(async (r) => {
    rc[r] = guild.roles.cache.find((rl) => rl.name === r)?.id;
    console.log(`Role ${r} found with id ${rc[r]}`);
  });
  client.roleCache = rc;
  let rci: roleCache = {};
  rolesToIgnore.forEach(async (r) => {
    rci[r] = guild.roles.cache.find((rl) => rl.name === r)?.id;
    console.log(`Role to ignore ${r} found with id ${rci[r]}`);
  });
  client.ignoredRoleCache = rci;
  Utils.UpdateMembers(client);
/*
  await client.guilds.cache.first().members.fetch(); // Update Member Cache
  const data = (await axios.get("https://denartcc.org/getRoster")).data;
  data.forEach(async (controller) => {
    if (client.guilds.cache.first().members.cache.has(controller.discord)) {
      let member = await client.guilds.cache.first().members.fetch(controller.discord);

      Utils.VerifyRoles(client, member, controller);
    }
  });
*/
  cron.schedule("*/5 * * * *", async () => {
    Utils.UpdateMembers(client);
  });
});

client.on("guildMemberAdd", (member) => {
  member.roles.add(client.roleCache["ZDV Guest"]);
});

client.loadEvents("./events");
client.loadCommands("./commands");
//client.loadDatabase(config.database);

client.login(config.discord.token);

export { guild };
