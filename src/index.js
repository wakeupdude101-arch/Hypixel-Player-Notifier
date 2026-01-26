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

client.on('interactionCreate', (interaction) => {

    const ign = interaction.options.get('username')?.value;
    const ign2 = interaction.options.get('username')?.value;
    const ip = interaction.options.get('server-ip')?.value;

    const bothMessage = `${ign2} is now offline on ${ip}!`;
    const singleMessage = `${ign2} is now offline!`;

    switch(interaction.commandName){
        case 'ping':
            interaction.reply('Pong!');
        break;
        case 'status':
            interaction.reply('So, Your Minecraft username is: ' + ign);
        break;
        case 'notify':
           if(ip === undefined){
            const notifyEmbed = new EmbedBuilder().setColor('Random').setTitle(singleMessage).setFields(
                { name: 'Uuid: ', value: 'be4281019322446a9e08aff752b0d4b4' },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
            interaction.reply({ embeds: [notifyEmbed] });
        }else{
            const notifyEmbed = new EmbedBuilder().setColor('Random').setTitle(bothMessage).setFields(
                { name: 'Uuid: ', value: 'be4281019322446a9e08aff752b0d4b4' },
                { name: 'You will be notified on next login.', value: '\u200b' },
            ).setThumbnail('https://i.imgur.com/LUn8WDe.png').setTimestamp().setFooter({ text: 'by @wakeupdude.', iconURL: 'https://imgur.com/a/SV1QkKc' });
            interaction.reply({ embeds: [notifyEmbed] });
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