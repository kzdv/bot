import Discord from "discord.js";
import Client from "../lib/Client";
import Log from "../lib/Log";
import axios, { AxiosAdapter, AxiosResponse } from "axios";
import Utils from "../lib/Utils";

export default async function (client: Client, message: Discord.Message) {
  if (message.channel.id === "834636255735840818") {
    let data: DiscordLink;
    try {
      data = JSON.parse(message.content);
    } catch(e) {
      // Not valid JSON, we'll treat like a normal message.
    }

    if (data && data.type === "Connecting") {
      Utils.linkDiscord(client, message, data);
      return;
    }
  }
  // Since we're not in the link channel, ignore all others from bots
  if (message.author.bot) return;

  if (message.channel.type === "dm") {
    // Only respond to version DMs, ignore the rest
    if (message.content.toLowerCase() === "version") {
      message.author.send(`MASTER CONTROL PROGRAM VERSION ${global.__version} BY DANIEL A. HAWTON. END OF LINE.`);
    }
    return;
  }

  const prefixRegex = new RegExp(`^(<@!?&?${client.user.id}>)\\s*`);
  if (prefixRegex.test(message.content)) {
    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const msg = message.content.slice(match.length).trim();
    let command = client.commands.get(msg) || findCommand(client, message.content.slice(match.length).trim().split(/ +/g)) || client.commands.get(cmd); // If command not found as match, try single word command
    if (command) {
      if (!command.checkPermissions(message)) {
        message.channel.send("YOU DO NOT HAVE ACCESS TO THIS REQUEST. END OF LINE.")
      } else {
        command.handle(message, message.content.slice(match.length).trim().split(/ +/g));
      }
    } else {
      let res: AxiosResponse;
      try {
        res = await axios({
          method: "POST",
          url: `http://lv2.vbrp.org/chatbot`,
          data: {
            req: msg
          }
        });
        let resp = res.data.response;
        if (resp === "%{UNKNOWN}") {
          message.channel.send(`I'm sorry, I didn't understand you.`);
        } else if (resp == "%{RESTART DEV}") {
          // Soon
        } else if (resp == "%{RESTART STAGE}") {
          // Soon
        } else if (resp == "%{GITPULL DEV}") {
          // Soon
        } else if (resp == "%{GITPULL STAGE}") {
          // Soon
        } else {
          message.channel.send(`${resp}`);
        }
      } catch(e) {
        message.channel.send(`I don't know how to do that and my brain doesn't appear to be working right now.`);
        Log.error(`Exception querying chatbot: ${e}`);
        console.trace();
      }
    }
  }
};

function findCommand(client: Client, args: string[]) {
  for (let [cmd, value] of client.commands) {
    let numWords = cmd.split(" ").length;
    let equivCmd = args.slice(0, numWords).join(" ");

    if (equivCmd.toLowerCase() == cmd.toLowerCase()) {
      return value;
    }
  }
}