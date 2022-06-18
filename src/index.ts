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
  ]
});
let guild: Discord.Guild;
//Log.info(`MASTER CONTROL PROGRAM ${global.__version}`);

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
  const rolesToIgnore = ["VATUSA/VATGOV Staff", "ZDV Senior Staff", "ZDV Staff"];
  let rc: roleCache = {};

  roles.forEach(async (r) => {
    rc[r] = guild.roles.cache.find((rl) => rl.name === r)?.id;
  });
  client.roleCache = rc;
  let rci: roleCache = {};
  rolesToIgnore.forEach(async (r) => {
    rci[r] = guild.roles.cache.find((rl) => rl.name === r)?.id;
  });
  client.ignoredRoleCache = rci;

  await client.guilds.cache.first().members.fetch(); // Update Member Cache
  const data = (await axios.get("https://denartcc.org/getRoster")).data;
  data.forEach(async (controller) => {
    if (client.guilds.cache.first().members.cache.has(controller.discord)) {
      let member = await client.guilds.cache.first().members.fetch(controller.discord);

      Utils.VerifyRoles(client, member, controller);
    }
  });

  let cronRunning = false;
  cron.schedule("*/5 * * * *", async () => {
    if (!cronRunning) {
      cronRunning = true;
      await client.guilds.cache.first().roles.fetch(); // Update Role Cache
      await client.guilds.cache.first().members.fetch(); // Update Member Cache
      const data = (await axios.get("https://denartcc.org/getRoster")).data;
      let dealtWith = [];
      data.forEach(async (controller) => {
        if (client.guilds.cache.first().members.cache.has(controller.discord)) {
          let member = await client.guilds.cache.first().members.fetch(controller.discord);
          dealtWith.push(member.id);
          Utils.VerifyRoles(client, member, controller);
        }
      });
      /*
        Coming soon (TM)
        client.guilds.cache.first().members.cache.forEach(member => {
          let ignore = false;
          Object.keys(client.ignoredRoleCache).forEach(k => {
            if (member.roles.cache.has(client.ignoredRoleCache[k])) ignore = true;
          });

          if (!ignore) {
            Log.info(`${member.nickname} is not linked on website, resetting to ZDV Guest`);
            let hasGuest = false;
            member.roles.cache.forEach(role => {
              if (role.id !== client.roleCache["ZDV Guest"]) {
                member.roles.remove(role);
              } else {
                hasGuest = true;
              }
            });

            if (!hasGuest) {
              member.roles.add(client.roleCache["ZDV Guest"]);
            }
          }
        });
        */

      cronRunning = false;
    }
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
