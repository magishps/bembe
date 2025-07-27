const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');  // путь к папке с командами
const commandFolders = fs.readdirSync(foldersPath);  // читаем папки внутри

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder); // путь к папке с конкретной группой команд
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // JS-файлы команд
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[ВНИМАНИЕ] В команде по пути ${filePath} отсутствует обязательное свойство "data" или "execute".`);
		}
	}
}


client.once(Events.ClientReady, readyClient => {
	console.log(`Готово! Залогинен как: ${readyClient.user.tag}`);
});

// Логин в дискорде с помощью токена
client.login(token);