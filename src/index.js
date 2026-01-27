require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

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

    

    const API_KEY = process.env.HYPIXEL_API;
    const username = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
    const uuid = await username.json();
    const PLAYER_UUID = uuid.id;
    const userStatus = await fetch(`https://api.hypixel.net/status?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const userData = await userStatus.json();
    const playerData = await fetch(`https://api.hypixel.net/v2/player?key=${API_KEY}&uuid=${PLAYER_UUID}`);
    const pData = await playerData.json();
   //console.log(pData);
    
    const onlineMessage = `${uuid.name} is now Online`;
    const offlineMessage = `${uuid.name} is now offline`;


 
    

    switch(interaction.commandName){
        case 'ping':
            interaction.reply({ ephemeral: true, content: 'Pong!'});
        break;
        case 'status':
            if (!uuid || !uuid.id){
               interaction.reply({ ephemeral: true, content: "Player doesn't exists" });
            }else if(userData.session.online === false ){
                const statusEmbed = new EmbedBuilder().setColor('Red').setTitle(offlineMessage).setFields(
                { name: 'Status: ', value: '🟥 Offline', inline: true },
                { name: 'Game: ', value: 'Skyblock'},
                { name: 'Last Login', value: `${pData.lastlogin}`, inline: true },
                { name: 'First Login', value: `${pData.firstlogin}`, inline: true },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
                interaction.reply({ ephemeral: true, embeds: [statusEmbed] });
            }else{
                const statusEmbed = new EmbedBuilder().setColor('Green').setTitle(onlineMessage).setFields(
                { name: 'Status: ', value: '🟩 Online' },
                { name: 'Game: ', value: 'Skyblock'},
                { name: 'Last Login', value: '```2 months ago```', inline: true },
                { name: 'First Login', value: '```2 months ago```', inline: true },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
            interaction.reply({ ephemeral: true, embeds: [statusEmbed] });
            }
        break;
        case 'notify':
           if(ip === undefined){
            const notifyEmbed = new EmbedBuilder().setColor('Random').setTitle(singleMessage).setFields(
                { name: 'Uuid: ', value: userData.uuid },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
        }else{
            const notifyEmbed = new EmbedBuilder().setColor('Random').setTitle(bothMessage).setFields(
                { name: 'Uuid: ', value: userData.uuid },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
            interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
        }
            
        break;
        case 'notify-list':
            interaction.reply('Sup buddy you aint powerful enough to use this command.');
        break;
        default:
            interaction.reply('Something went wrong, MB!');
    };
});



client.login(process.env.TOKEN);