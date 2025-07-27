const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

сonst foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {

}

client.once(Events.ClientReady, readyClient => {
	console.log(`Готово! Залогинен как: ${readyClient.user.tag}`);
});

// Логин в дискорде с помощью токена
client.login(token);