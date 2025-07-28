const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

// Создаём нового клиента Discord с нужными намерениями
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Создаём коллекцию (словарь) для хранения команд
client.commands = new Collection();

// Путь к папке с командами
const foldersPath = path.join(__dirname, 'commands');
// Читаем все подпапки внутри этой папки
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Путь к конкретной папке с группой команд
	const commandsPath = path.join(foldersPath, folder);
	// Фильтруем только .js файлы
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		// Проверяем, есть ли обязательные свойства: data и execute
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[ВНИМАНИЕ] Команда в файле ${filePath} не содержит обязательного свойства "data" или "execute".`);
		}
	}
}

// Событие: бот успешно подключился
client.once(Events.ClientReady, readyClient => {
	console.log(`✅ Бот готов! Залогинен как: ${readyClient.user.tag}`);
});

// Обработка входящих взаимодействий (slash-команд)
client.on(Events.InteractionCreate, async interaction => {
	// Проверяем, что это именно slash-команда
	if (!interaction.isChatInputCommand()) return;

	// Получаем нужную команду по имени
	const command = interaction.client.commands.get(interaction.commandName);

	// Если команда не найдена
	if (!command) {
		console.error(`❌ Команда "${interaction.commandName}" не найдена.`);
		return;
	}

	try {
		// Пытаемся выполнить команду
		await command.execute(interaction);
	}
	catch (error) {
		console.error('⚠️ Ошибка при выполнении команды:', error);

		// Если уже был ответ — отправляем follow-up
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'Произошла ошибка при выполнении команды!',
				flags: MessageFlags.Ephemeral,
			});
		}
		else {
			// Если ответа ещё не было — отправляем обычный ответ
			await interaction.reply({
				content: 'Произошла ошибка при выполнении команды!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Запускаем бота
client.login(token);
