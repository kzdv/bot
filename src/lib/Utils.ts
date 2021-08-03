import Discord, { GuildMember } from "discord.js";
import Client from "./Client";
import Controller from "./Controller";
import Log from "./Log";

class Utils {
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

  // @TODO define type for controller
  static VerifyRoles(client: Client, member: GuildMember, con: any) {
    let shouldHaveRoles = [];
    // Check guest, home, visitor
    if (Controller.isHomeController(con)) {
      shouldHaveRoles.push(client.roleCache["Home Controller"]);
    } else if (Controller.isVisitor(con)) {
      shouldHaveRoles.push(client.roleCache["Visiting Controller"]);
    } else {
      shouldHaveRoles.push(client.roleCache["ZDV Guest"]);
    }

    // Check roles -- Removed for now
/*    if (Controller.isHomeController(con)) {
      if (Controller.isSeniorStaff(con)) {
        shouldHaveRoles.push(client.roleCache["ZDV Senior Staff"]);
      } else if (Controller.isStaff(con)) {
        shouldHaveRoles.push(client.roleCache["ZDV Staff"]);
      }

      if (Controller.hasRole(con, "MTR") || Controller.hasRole(con, "INS") || Controller.hasRole(con, "TA")) {
        shouldHaveRoles.push(client.roleCache["Training Staff"]);
      }

      if (Controller.hasRole(con, "Web Team") || Controller.hasRole(con, "WM")) {
        shouldHaveRoles.push(client.roleCache["Web Team"]);
      }

      if (Controller.hasRole(con, "Events Team") || Controller.hasRole(con, "EC")) {
        shouldHaveRoles.push(client.roleCache["Event Team"]);
      }

      if (Controller.hasRole(con, "FE Team") || Controller.hasRole(con, "FE")) {
        shouldHaveRoles.push(client.roleCache["FE Team"]);
      }
    }*/

    // Rating push
    let ratingrole = Object.keys(Controller.rating_to_role).find(k => Controller.rating_to_role[k] === con.rating_id-1);
    shouldHaveRoles.push(client.roleCache[ratingrole]);

    // Okay, now let's check their roles...
    // Assign roles they should have
    shouldHaveRoles.forEach(val => {
      if (!member.roles.cache.has(val)) {
        Log.info(`Member ${member.nickname} is missing role ${val}`);
        member.roles.add(val).catch((err) => {
          Log.error(`Error adding role to ${member.nickname}, role is ${member.guild.roles.cache.get(val).name}: ${err}`);
        });
      }
    });

    // Now check roles they have to find ones they should not [but only ones we care about]
    member.roles.cache.forEach(r => {
      if (Object.values(client.roleCache).indexOf(r.id) > -1) {
        if (!shouldHaveRoles.includes(r.id)) {
          Log.info(`Member ${member.nickname} shouldn't have role ${r.name}`);
          member.roles.remove(r.id).catch((err) => {
            Log.error(`Error deleting role from ${member.nickname}, role is ${r.name}: ${err}`);
          });
        }
      }
    });

    let ignore = false;
    Object.keys(client.ignoredRoleCache).forEach(k => {
      if (member.roles.cache.has(client.ignoredRoleCache[k])) ignore = true;
    });

    if (!ignore) {
      let nickname = `${con.first_name} - ${con.initials} | ${Controller.getThirdArgument(con)}`;

      if (member.nickname !== nickname && member.user.username != nickname) {
        Log.info(`Member ${member.nickname} to be reset to ${nickname}`);
        member.setNickname(nickname).catch((err) => {
          Log.error(`Error changing nickname of ${member.nickname} to ${nickname}: ${err}`);
        });
      }
    }
  }
}

export default Utils;
