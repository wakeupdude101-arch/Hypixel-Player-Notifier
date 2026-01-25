require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
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
    