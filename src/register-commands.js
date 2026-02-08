require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, Options } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },

    {
        name: 'status',
        description: 'Get the status of the player.',
        options: [
            {
                name: 'username',
                description: 'Minecraft name',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },

    {
        name: 'notify',
        description: 'Notifies user if player comes online.',
        options: [
            {
                name: 'username',
                description: 'Minecraft Name',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },

    {
        name: 'notify-list',
        description: 'List of all players to notify',
    },
    {
        name: 'notify-remove',
        description: 'Remove player from notify list',
        options: [
            {
                name: 'username',
                description: 'Minecraft Name',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },

    {
        name: 'api-key',
        description: 'Register your hypixel api key.',
        options: [
            {
                name: 'key',
                description: 'Enter your Api key.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },

];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering Slash commands");


        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("slash commands were registered succesfully!");
    }catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();
    