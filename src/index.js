const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is alive.');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
const User = require('../models/User');
console.log('User Model check:', User.findOneAndUpdate ? '✅ Working' : '❌ Broken');
console.log('User Value:', User);
require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, Partials } = require('discord.js');
const data = require("../config/data");

const db = new data();

db.connect();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.username} is online.`);
    startHeartbeat(client);
});
client.login(process.env.TOKEN).catch(err => {
    console.error("DISCORD LOGIN ERROR:", err.message);
});

client.on('messageCreate', (message) => {
    if(message.author.bot){
        return;
    }


    console.log(message.content);
    if(message.content === '$help'){
        message.reply('https://tenor.com/view/help-gif-13132856299145404894');
        message.react('🤨');
    };
});

client.on('interactionCreate', async (interaction) => {

    const ign = interaction.options.get('username')?.value;
    const ign2 = interaction.options.get('username')?.value;
    const key = interaction.options.get('key')?.value;

    const bothMessage = `${ign2} is now offline on ${key}!`;
    const singleMessage = `${ign2} is now offline!`;
    const statMessage = `${ign} is now offline!`;

    
    async function lovely(userKey){
    const API_KEY = userKey;
    const username = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const uuid = await username.json();
    const PLAYER_UUID = uuid.id;
    const keyFetcher = await fetch(`https://api.hypixel.net/status?key=${userKey}`);
    const keyGrabber = await keyFetcher.json();
    const keyChecker = keyGrabber.cause;
    const userStatus = await fetch(`https://api.hypixel.net/status?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const userData = await userStatus.json();
    const playerData = await fetch(`https://api.hypixel.net/v2/player?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const pData = await playerData.json();
    // const playerSkinHead = await fetch(`https://mineskin.eu/avatar/${PLAYER_UUID}`);
    // const headSkin = await playerSkinHead.json();
    
    const lastLogin = pData.player?.lastLogin || 'Api Disabled!';
    const firstLogin = pData.player?.firstLogin;
    const gameTypo = userData.session?.gameType || 'Api Disabled!';
    const modeTypo = userData.session?.mode || 'Unknown!';
    const lastLogout = pData.player?.mostRecentGameType || 'Api Disabled!';
    const discordName = pData.player?.socialMedia?.links?.DISCORD || 'Not Linked!';
    const doesntExist = "Player doesn't exist.";
    const invalidApiKey = "Invalid Api key!";
    const validApiKey = "Successfuly Registered Api Key!";
    //console.log(pData.player.firstLogin);
    // console.log("Remaining:", userData.headers.get('RateLimit-Remaining'));
    
    const onlineMessage = `${uuid.name} is now Online`;
    const offlineMessage = `${uuid.name} is now offline`;
    const ipOnlineMessage = `${uuid.name} is now Online`;
    const ipOfflineMessage = `${uuid.name} is now Offline`;
    // console.log(keyChecker);
    return {uuid, userData, PLAYER_UUID, pData, lastLogin, firstLogin, lastLogout, statMessage, onlineMessage, offlineMessage, bothMessage, singleMessage, discordName, ipOnlineMessage, ipOfflineMessage, doesntExist, keyChecker, invalidApiKey, gameTypo, modeTypo, validApiKey};
    };

    if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'status-remover') {
            const profile = await User.findOne({ discordId: interaction.user.id });
            if (!profile) return await interaction.respond([]);

            const focusedValue = interaction.options.getFocused().toLowerCase();
            const choices = profile.trackedPlayers
                .filter(p => p.username.toLowerCase().includes(focusedValue))
                .map(p => ({ name: p.username, value: p.username }))
                .slice(0, 25);

            return await interaction.respond(choices);
        }
    }
    if (!interaction.isChatInputCommand()) return;

 
    

    switch(interaction.commandName){
        case 'ping':
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply({ ephemeral: true, content: 'Pong!'});
        break;
        case 'api-key':
        await interaction.deferReply({ ephemeral: true });
        const Data3 = await lovely(key);
            if(Data3.keyChecker === "Invalid API key"){
                const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data3.invalidApiKey).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });
            return;
            }else{
            await User.findOneAndUpdate({
                discordId: interaction.user.id
            }, {
                $set: { hypixelKey: key }
            }, {
                upsert: true, new: true
            });
            const notifyEmbed = new EmbedBuilder().setColor('Green').setTitle(Data3.validApiKey).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });
            }
        break;
        case 'status':
        await interaction.deferReply();
        const profile2 = await User.findOne({ discordId: interaction.user.id });
        if (!profile2 || !profile2.hypixelKey) {
            const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle("You haven't registered! Use `/api-key` first.").setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
        return await interaction.editReply({embeds: [notifyEmbed]});
        }
        const Data = await lovely(profile2.hypixelKey);
        if(Data.keyChecker === "Invalid API key"){
                const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data.invalidApiKey).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ embeds: [notifyEmbed] });
            return;
            }
        let firstTime;
        if(!Data.firstLogin || isNaN(Data.firstLogin)){
            firstTime = "Hasn't logged into hypixel."
        }else{
            firstTime = `<t:${Math.floor(Data.firstLogin/1000)}:F>`;
        }
        let secondTime;
        if (!Data.lastLogin || isNaN(Data.lastLogin)){
            secondTime = 'Unavailable';
        }else{
            secondTime = `<t:${Math.floor(Data.lastLogin/1000)}:R>`;
        }
        const betterTicks = `\`${Data.discordName}\``;

            if (!Data.uuid || !Data.uuid.id){
               const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data.doesntExist).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ embeds: [notifyEmbed] });
               return;
            }else if(Data.userData.session.online === false ){
                const statusEmbed = new EmbedBuilder().setColor('Red').setTitle(Data.offlineMessage).setFields(
                { name: 'Status: ', value: '🟥 Offline'},
                { name: 'Discord ', value: betterTicks},
                { name: 'Last Online', value: secondTime},
                { name: 'First Login', value: firstTime },
            ).setThumbnail(`https://mineskin.eu/body/${Data.PLAYER_UUID}.png`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
                await interaction.editReply({ embeds: [statusEmbed] });
            }else{
                const statusEmbed = new EmbedBuilder().setColor('Green').setTitle(Data.onlineMessage).setFields(
                { name: 'Status: ', value: '🟩 Online' },
                { name: 'Discord: ', value: betterTicks},
                { name: 'Game: ', value: Data.gameTypo, inline: true},
                { name: 'Mode: ', value: Data.modeTypo, inline: true},
                { name: 'Joined', value: secondTime},
                { name: 'First Login', value: firstTime},
            ).setThumbnail(`https://mineskin.eu/body/${Data.PLAYER_UUID}.png`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ embeds: [statusEmbed] });
            }
        break;
        case 'notify':
        await interaction.deferReply({ ephemeral: true });
        const profile = await User.findOne({ discordId: interaction.user.id });
        if (!profile || !profile.hypixelKey) {
        const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle("You haven't registered! Use `/api-key` first.").setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
        return await interaction.editReply({embeds: [notifyEmbed]});
        }
        if (profile.trackedPlayers.length >= 10) {
            const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle("Your notify list is full! (10/10 players).").setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
        return await interaction.editReply({embeds: [notifyEmbed]});
        }
        const Data2 = await lovely(profile.hypixelKey);
        const isAlreadyTracking = profile.trackedPlayers.some(p => p.uuid === Data2.PLAYER_UUID);
        
        
        if(Data2.keyChecker === "Invalid API key"){
                const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data2.invalidApiKey).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });
            return;
        }else if (!Data2.uuid || !Data2.uuid.id){
               const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data2.doesntExist).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });
               return;
        }else if (isAlreadyTracking) {
        return await interaction.editReply("You are already tracking this player!");
        }else if(Data2.userData.session.online === false){
            await User.findOneAndUpdate(
                { discordId: interaction.user.id },
                { $push: { trackedPlayers: { uuid: Data2.PLAYER_UUID, username: Data2.uuid.name, lastStatus: false } } }
         );
            const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data2.ipOfflineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID},
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.'});
            return await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });
        }else if(Data2.userData.session.online === true){
             await User.findOneAndUpdate(
                { discordId: interaction.user.id },
                { $push: { trackedPlayers: { uuid: Data2.PLAYER_UUID, username: Data2.uuid.name, lastStatus: true } } }
         );
            const notifyEmbed = new EmbedBuilder().setColor('Green').setTitle(Data2.ipOnlineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.'});
            return await interaction.editReply({ ephemeral: true, embeds: [notifyEmbed] });

        };
            
        break;
        case 'notify-list':
        await interaction.deferReply({ ephemeral: true });

        const userProfile = await User.findOne({ discordId: interaction.user.id });

        if (!userProfile || !userProfile.trackedPlayers || userProfile.trackedPlayers.length === 0) {
        const emptyEmbed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('Your Notify List')
            .setDescription('Your list is currently empty. Use `/notify` to add someone!')
            .setTimestamp()
            .setFooter({ text: 'Made by @wakeupdude.' });
        
        return await interaction.editReply({ embeds: [emptyEmbed] });
        }

        const playerList = userProfile.trackedPlayers.map((player, index) => {
        const statusEmoji = player.lastStatus ? '🟩' : '🟥';
        return `**${index + 1}.** ${statusEmoji} **${player.username}** \n ╰ \`${player.uuid}\``;
         }).join('\n\n');

        const listEmbed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Your Tracked Players (${userProfile.trackedPlayers.length}/10)`)
        .setDescription(playerList)
        .setTimestamp()
        .setFooter({ text: 'Made by @wakeupdude.' });

         await interaction.editReply({ embeds: [listEmbed] });
        break;

        case 'notify-remove':
        await interaction.deferReply({ ephemeral: true });
        const targetName = interaction.options.get('username')?.value;
        const profile4 = await User.findOne({ discordId: interaction.user.id });

        if (!profile4 || !profile4.trackedPlayers.length) {
        const emptyEmbed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('List Empty')
            .setDescription("You aren't tracking anyone yet, so there's nothing to remove!")
            .setTimestamp()
            .setFooter({ text: 'Made by @wakeupdude.' });
        
        return await interaction.editReply({ embeds: [emptyEmbed] });
        }

        const initialLength = profile4.trackedPlayers.length;
    
        profile4.trackedPlayers = profile4.trackedPlayers.filter(
        p => p.username.toLowerCase() !== targetName.toLowerCase()
        );

        if (profile4.trackedPlayers.length === initialLength) {
        const notFoundEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Player Not Found')
            .setDescription(`I couldn't find **${targetName}** on your notify list. Make sure the spelling is correct!`)
            .setTimestamp()
            .setFooter({ text: 'Made by @wakeupdude.' });
        
        return await interaction.editReply({ embeds: [notFoundEmbed] });
        }

        await profile4.save();
    
        const successEmbed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Player Removed')
        .setDescription(`Successfully removed **${targetName}** from your notifications.`)
        .addFields({ name: 'Remaining Slots', value: `${profile4.trackedPlayers.length}/10`, inline: true })
        .setTimestamp()
        .setFooter({ text: 'Made by @wakeupdude.' });

        await interaction.editReply({ embeds: [successEmbed] });
        break;

        case 'status-notify':
    await interaction.deferReply();
    
    const ign5 = interaction.options.get('username')?.value;
    const profile6 = await User.findOne({ discordId: interaction.user.id });

    if (!profile6 || !profile6.hypixelKey) {
        return await interaction.editReply("Use `/api-key` first!");
    }

    const Data4 = await lovely(profile6.hypixelKey, ign5); 
    if (isOnline === false && currentArea === 'Unknown') {
    const warningEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('Limited API Access')
        .setDescription(`I've added **${Data4.uuid.name}**, but their **Online Status API** is turned off.\n\nTo get notifications, they need to run \`/settings\` on Hypixel and enable the **Online Status** and **Recent Games** API.`)
        .setTimestamp()
        .setFooter({ text: 'Made by @wakeupdude.' });

    await interaction.followUp({ embeds: [warningEmbed], ephemeral: true });
}

    if (!Data4.uuid) return await interaction.editReply("Player not found.");

    const isOnline = Data4.userData.session.online;
    const currentArea = Data4.userData.session.mode || 'Unknown';

    const statusEmbed = new EmbedBuilder()
        .setColor(isOnline ? 'Green' : 'Red')
        .setTitle(`Status for ${Data4.uuid.name}`)
        .addFields(
            { name: 'Currently', value: isOnline ? '🟩 Online' : '🟥 Offline', inline: true },
            { name: 'Area', value: `${currentArea}`, inline: true }
        )
        .setThumbnail(`https://mineskin.eu/avatar/${Data4.PLAYER_UUID}`)
        .setFooter({ text: 'Auto-added to your notify list!',
            text: 'Made by @wakeupdude.'
         });

    const alreadyTracking = profile6.trackedPlayers.some(p => p.uuid === Data4.PLAYER_UUID);

    if (!alreadyTracking) {
        profile6.trackedPlayers.push({
            username: Data4.uuid.name,
            uuid: Data4.PLAYER_UUID,
            lastStatus: isOnline,
            lastArea: currentArea
        });
        await profile6.save();
    }

    await interaction.editReply({ embeds: [statusEmbed] });
    break;

    case 'status-remover': {
    await interaction.deferReply();
    const ign3 = interaction.options.getString('username');

    const user = await User.findOne({ discordId: interaction.user.id });

    const playerExists = user?.trackedPlayers.some(
        p => p.username.toLowerCase() === ign3.toLowerCase()
    );

    if (!playerExists) {
        const errorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Player Not Found')
            .setDescription(`**${ign3}** isn't on your watch list, so I can't remove them!`)
            .setTimestamp()
            .setFooter({ text: 'Made by @wakeupdude.' });

        return await interaction.editReply({ embeds: [errorEmbed] });
    }

    await User.findOneAndUpdate(
        { discordId: interaction.user.id },
        { $pull: { trackedPlayers: { username: { $regex: new RegExp(`^${ign3}$`, 'i') } } } }
    );

    const successEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Player Removed')
        .setDescription(`Successfully removed **${ign3}** from your watch list.`)
        .addFields({ 
            name: 'Slots Available', 
            value: `${user.trackedPlayers.length - 1}/10`, 
            inline: true 
        })
        .setTimestamp()
        .setFooter({ text: 'Made by @wakeupdude.' });

    await interaction.editReply({ embeds: [successEmbed] });
    break;
}
        default:
            interaction.reply('Something went wrong, MB!');
        };
        });

async function startHeartbeat(client) {
    setInterval(async () => {
        const startTime = Date.now();
        console.log('Checking players...');

        const users = await User.find({ "trackedPlayers.0": { $exists: true } });

        for (const user of users) {
            let userNeedsSaving = false;

            for (const player of user.trackedPlayers) {
                try {
                    const response = await fetch(`https://api.hypixel.net/status?key=${user.hypixelKey}&uuid=${player.uuid}`);

                    if (response.status === 429) {
                        console.log(`Rate limited on key ending in ...${user.hypixelKey.slice(-4)}`);
                        break; 
                    }

                    const data = await response.json();
                    if (!data.success || !data.session) continue;

                    const isOnlineNow = data.session.online;
                    const currentArea = data.session.mode || 'Unknown';

                    const statusChanged = isOnlineNow !== player.lastStatus;
                    
                    const areaChanged = isOnlineNow && player.lastStatus && currentArea !== player.lastArea;

                    if (statusChanged || areaChanged) {
                        const discordUser = await client.users.fetch(user.discordId).catch(() => null);
                        
                        if (discordUser) {
                            let embed = new EmbedBuilder().setTimestamp();

                            if (statusChanged) {
                                embed.setColor(isOnlineNow ? 'Green' : 'Red')
                                     .setTitle(`${isOnlineNow ? '🟩' : '🟥'} Status: ${player.username}`)
                                     .setDescription(`**${player.username}** is now **${isOnlineNow ? 'ONLINE' : 'OFFLINE'}**!`)
                                     .setTimestamp()
                                     .setFooter({ text: 'Made by @wakeupdude.' });
                            } else if (areaChanged) {
                                embed.setColor('Blue')
                                     .setTitle(`Movement: ${player.username}`)
                                     .setDescription(`**${player.username}** moved from **${player.lastArea}** to **${currentArea}**!`)
                                     .setTimestamp()
                                     .setFooter({ text: 'Made by @wakeupdude.' });
                            }

                            await discordUser.send({ embeds: [embed] }).catch(() => {});
                        }

                        player.lastStatus = isOnlineNow;
                        player.lastArea = currentArea;
                        userNeedsSaving = true;
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));

                } catch (err) {
                    console.error(`Error checking ${player.username}:`, err);
                }
            }

            if (userNeedsSaving) {
                user.markModified('trackedPlayers');
                await user.save();
            }
        }

        const duration = (Date.now() - startTime) / 1000;
        console.log(`Checking done in ${duration}s.`);
    }, 60000);
}


console.log("Token found:", process.env.TOKEN ? "Yes" : "No");