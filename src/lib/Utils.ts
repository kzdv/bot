import Discord from "discord.js";
import Client from "./Client";
import Rcon from "rcon";
import Log from "./Log";

class Utils {
  static linkDiscord(client: Client, message: Discord.Message, data: DiscordLink): void {
    const license = data.license.replace("license:", "");
    const username = client.users.cache.get(data.discord);

    client.db.getPool().execute("UPDATE `users` SET `discord`=?, `discordid`=? WHERE `identifier`=?", [username, data.discord, data.license], (err) => {
      if (err) {
        message.channel.send("Could not query database.");
        Log.error(`Error updating discord information: ${err.message}`);
        console.trace();
        return;
      }
      message.delete();
    });
  }

  static isVBRP(details: string): boolean {
    if (details.indexOf("VBRP") !== -1 || details.indexOf("Vespucci Beach") !== -1) {
      return true;
    }

    return false;
  }

  static sendMessage(
    guild: Discord.Guild,
    announceChannel: string,
    msg: string,
    embeddedmsg: Discord.MessageEmbed,
  ): void {
    const channel = guild.channels.cache.find((ch) => (ch.name === announceChannel || ch.id === announceChannel));
    if (!channel) return;
    (channel as Discord.TextChannel).send(msg, { embed: embeddedmsg, split: true });
  }

  static sendRconMessage(client: Client, msg: string) {
    client.rcon.connect();
    client.rcon.send(msg);
  }
}

export default Utils;
