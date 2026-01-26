require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

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
 

    switch(interaction.commandName){
        case 'ping':
            interaction.reply('Pong!');
        break;
        case 'status':
            const ign = interaction.options.get('username').value;
            interaction.reply('So, Your Minecraft username is: ' + ign);
        break;
        case 'notify':
            const ign2 = interaction.options.get('username').value;
            const ip = interaction.options.get('server-ip')?.value;
            
            finalmessage = 'Minecraft ign = ' + ign2;
            if (ip != null){
                finalmessage += '\n Server ip = ' + ip;
            }
                interaction.reply(finalmessage);
            
        break;
        default:
            interaction.reply('Something went wrong, MB!');
    };
});


client.login(process.env.TOKEN);