import Discord from "discord.js";
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

global.__version = "1.1.3";
global.__basedir = __dirname;

const config: Config = JSON.parse(fs.readFileSync(path.resolve("config.json")).toString());

const client = new Client();
let guild: Discord.Guild;
let cronRunning = false;

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

  runJob();

  cron.schedule("*/5 * * * *", async () => {
    if (!cronRunning) {
      cronRunning = true;

      runJob();
      
      cronRunning = false;
    }
  });
});

const runJob = async () => {
  await guild.roles.fetch(); // Update Role Cache
  await guild.members.fetch(); // Update Member Cache
  Log.info(`Starting roles check`);
  const data = (await axios.get("https://denartcc.org/getRoster")).data;
  let dealtWith = [];
  data.forEach(async (controller) => {
    if (client.guilds.cache.first().members.cache.has(controller.discord)) {
      let member = await guild.members.fetch(controller.discord);
      dealtWith.push(member.id);
      Utils.VerifyRoles(client, member, controller);
    }
  });

  Log.info(`Starting not linked check: ${JSON.stringify(dealtWith)}`);
  guild.members.cache.forEach((member) => {
    Log.info(`Checking ${member.nickname || member.user.tag}: ${member.id}`)
    let ignore = false;
    if (dealtWith.includes(member.id)) return;

    Object.keys(client.ignoredRoleCache).forEach((k) => {
      if (member.roles.cache.has(client.ignoredRoleCache[k])) {
        Log.info(`${member.nickname || member.user.tag} has ignored role: ${k}`);
        ignore = true;
      }
    });

    if (!ignore) {
      Log.info(`${member.nickname || member.user.tag} is not linked on website, resetting to ZDV Guest`);
      let hasGuest = false;
      member.roles.cache.forEach((role) => {
        if (role.id !== client.roleCache["ZDV Guest"]) {
/*          member.roles.remove(role).catch((err) => {
            console.log(`Couldn't remove role ${role.name} from ${member.nickname || member.user.tag}: ${err}`);
          }); */
        } else {
          hasGuest = true;
        }
      });

      if (!hasGuest) {
/*        member.roles.add(client.roleCache["ZDV Guest"]).catch((err) => {
          console.log(`Couldn't add ZDV Guest role to ${member.nickname || member.user.tag}: ${err}`);
        }); */
      }
    }
  });
}

client.on("guildMemberAdd", (member) => {
  member.roles.add(client.roleCache["ZDV Guest"]);
});

client.loadEvents("./events");
client.loadCommands("./commands");
client.loadDatabase(config.database);

client.login(config.discord.token);

export { guild };
