require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected via .env!'))
  .catch(err => console.log(err));

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.username} is online.`);
});

client.on('messageCreate', (message) => {
    if(message.author.bot){
        return;
    }


    console.log(message.content);
    if(message.content === '$help'){
        message.reply('Looking for help? How can I assist you?');
        message.react('🤨');
    };
});

client.on('interactionCreate', async (interaction) => {

    const ign = interaction.options.get('username')?.value;
    const ign2 = interaction.options.get('username')?.value;
    const ip = interaction.options.get('server-ip')?.value;

    const bothMessage = `${ign2} is now offline on ${ip}!`;
    const singleMessage = `${ign2} is now offline!`;
    const statMessage = `${ign} is now offline!`;

    
    async function lovely(){
    const API_KEY = process.env.HYPIXEL_API;
    const username = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const uuid = await username.json();
    const PLAYER_UUID = uuid.id;
    const userStatus = await fetch(`https://api.hypixel.net/status?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const userData = await userStatus.json();
    const playerData = await fetch(`https://api.hypixel.net/v2/player?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const pData = await playerData.json();
    // const playerSkinHead = await fetch(`https://mineskin.eu/avatar/${PLAYER_UUID}`);
    // const headSkin = await playerSkinHead.json();
    
    const lastLogin = pData.player?.lastLogin || 'Api Disabled!';
    const firstLogin = pData.player?.firstLogin;
    const lastLogout = pData.player?.mostRecentGameType || 'Api Disabled!';
    const discordName = pData.player?.socialMedia?.links?.DISCORD || 'Not Linked!';
    //console.log(pData.player.firstLogin);
    
    const onlineMessage = `${uuid.name} is now Online`;
    const offlineMessage = `${uuid.name} is now offline`;
    const ipOnlineMessage = `${uuid.name} is now Online on ${ip}`
    const ipOfflineMessage = `${uuid.name} is now Offline on ${ip}`
    return {uuid, userData, PLAYER_UUID, pData, lastLogin, firstLogin, lastLogout, statMessage, onlineMessage, offlineMessage, bothMessage, singleMessage, discordName, ipOnlineMessage, ipOfflineMessage};
    };


 
    

    switch(interaction.commandName){
        case 'ping':
            interaction.reply({ ephemeral: true, content: 'Pong!'});
        break;
        case 'status':
        const Data = await lovely();
        const firstTime = `<t:${Math.floor(Data.firstLogin/1000)}:F>`;
        let secondTime;
        if (!Data.lastLogin || isNaN(Data.lastLogin)){
            secondTime = 'Unavailable';
        }else{
            secondTime = `<t:${Math.floor(Data.lastLogin/1000)}:R>`;
        }
        const betterTicks = `\`${Data.discordName}\``;

            if (!Data.uuid || !Data.uuid.id){
               interaction.reply({ ephemeral: true, content: "Player doesn't exist." });
               return;
            }else if(Data.userData.session.online === false ){
                const statusEmbed = new EmbedBuilder().setColor('Red').setTitle(Data.offlineMessage).setFields(
                { name: 'Status: ', value: '🟥 Offline'},
                { name: 'Discord ', value: betterTicks},
                { name: 'Last Online', value: secondTime},
                { name: 'First Login', value: firstTime },
            ).setThumbnail(`https://mineskin.eu/body/${Data.PLAYER_UUID}.png`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
                interaction.reply({ ephemeral: true, embeds: [statusEmbed] });
            }else{
                const statusEmbed = new EmbedBuilder().setColor('Green').setTitle(Data.onlineMessage).setFields(
                { name: 'Status: ', value: '🟩 Online' },
                { name: 'Discord: ', value: betterTicks},
                { name: 'Game: ', value: Data.lastLogout},
                { name: 'Joined', value: secondTime},
                { name: 'First Login', value: firstTime},
            ).setThumbnail(`https://mineskin.eu/body/${Data.PLAYER_UUID}.png`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            interaction.reply({ ephemeral: true, embeds: [statusEmbed] });
            }
        break;
        case 'notify':
        const Data2 = await lovely();
        if (!Data2.uuid || !Data2.uuid.id && ip === undefined){
               interaction.reply({ ephemeral: true, content: "Player doesn't exist." });
               return;
        }else if (!Data2.uuid || !Data2.uuid.id){
               interaction.reply({ ephemeral: true, content: "Player doesn't exist" });
               return;
        }else if(ip === undefined && Data2.userData.session.online === false){
            const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data2.offlineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.' });
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
        }else if(ip === undefined && Data2.userData.session.online === true){
            const notifyEmbed = new EmbedBuilder().setColor('Green').setTitle(Data2.onlineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID },
                { name: 'You will be notified on next login.', value: '' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.'});
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
        }else if(Data2.userData.session.online === false){
            const notifyEmbed = new EmbedBuilder().setColor('Red').setTitle(Data2.ipOfflineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID},
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.'});
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
        }else if(Data2.userData.session.online === true){
            const notifyEmbed = new EmbedBuilder().setColor('Green').setTitle(Data2.ipOnlineMessage).setFields(
                { name: 'Uuid: ', value: Data2.PLAYER_UUID },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail(`https://mineskin.eu/avatar/${Data2.PLAYER_UUID}`).setTimestamp().setFooter({ text: 'Made by @wakeupdude.'});
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });

        };
            
        break;
        case 'notify-list':
            interaction.reply('Sup buddy you aint powerful enough to use this command.');
        break;
        default:
            interaction.reply('Something went wrong, MB!');
    };
});



client.login(process.env.TOKEN);