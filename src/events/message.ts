import Discord from "discord.js";
import Client from "../lib/Client";
import Log from "../lib/Log";
import axios, { AxiosAdapter, AxiosResponse } from "axios";
import Utils from "../lib/Utils";

export default async function (client: Client, message: Discord.Message) {
  // Since we're not in the link channel, ignore all others from bots
  if (message.author.bot) return;

  if (message.channel.type === "DM") {
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
