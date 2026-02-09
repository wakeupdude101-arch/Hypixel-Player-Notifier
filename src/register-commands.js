require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, Options } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },

    {
        name: 'status',
        description: 'Get the status of the player.',
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
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
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
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
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: 'notify-remove',
        description: 'Remove player from notify list',
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
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
        dm_permission: true,
        integration_types: [0, 1],
        contexts: [0, 1, 2],
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
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log("slash commands were registered succesfully!");
    }catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();
    