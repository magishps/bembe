const fs = require('node:fs'); // Файловая система
const path = require('node:path'); // Для работы с путями файлов
const { Client, Events, GatewayIntentBits, Collection, AttachmentBuilder, Message } = require('discord.js'); // Библиотека для создания ботов
const { token } = require('./config.json'); // Токен
const fetch = require('node-fetch'); // Скачивание изображений
const Jimp = require('jimp'); // Для смены расширения файлов
const GIFEncoder = require('gif-encoder-2');
const { PassThrough } = require('stream');
const { listExcelFiles, getMonthlyForecast } = require('./commands/utility/event/RandomWeather'); // Импорт функции для работы с погодой
const cron = require('node-cron');
const { trySendForecastByLastMessage } = require('./commands/utility/event/tryRandomWeather');




const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent
	] 
});

const handleRandomReaction = require('./commands/utility/event/randomReaction');
const channelId = '1400536179648237720'; // ID канала для отправки прогноза погоды

function getSeasonFromMonth(month) {
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
}

client.commands = new Collection();
// путь к папке с командами
const foldersPath = path.join(__dirname, 'commands');
// читаем папки внутри
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// путь к папке с конкретной группой команд
	const commandsPath = path.join(foldersPath, folder);
	// JS-файлы команд
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
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


client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Готово! Залогинен как: ${readyClient.user.tag}`); // Логин
	
	
	
	listExcelFiles();

	

	 // Планировщик: 1-е число месяца в 00:00
  cron.schedule('*/1 * * * *', async () => {
	await trySendForecastByLastMessage(client, channelId, getSeasonFromMonth, getMonthlyForecast);
    const now = new Date();
    const season = getSeasonFromMonth(now.getMonth());
    const forecast = getMonthlyForecast(season);
    try {
      const channel = await client.channels.fetch(channelId);
      if (channel && channel.isTextBased()) {
        await channel.send(forecast);
        console.log('Прогноз был успешно отправлен');
      } else {
        console.error('Канал не текстовый или не найден');
      }
    } catch (error) {
      console.error('Ошибка при отправке прогноза:', error);
    }
  });
});


client.on(Events.InteractionCreate, async Interaction => {
	if (!Interaction.isChatInputCommand()) return;

	const command = Interaction.client.commands.get(Interaction.commandName);

	if (!command) {
		console.error(`Нет команды ${Interaction.commandName} или найдено`);
		return;
	}

	try {
		await command.execute(Interaction);
	}
	catch (error) {
		console.error(error);
		if (Interaction.replied || Interaction.deferred) {
			await Interaction.followUp({ content: 'Произошла ошибка при выполнении команды!', flags: MessageFlags.Ephemeral });
		}
		else {
		// Если ответ ещё не отправлен — отправляем сообщение с ошибкой
			await Interaction.reply({ content: 'Произошла ошибка при выполнении команды!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on('messageCreate', async (Message) => { // Обработка сообщений
	try {
		await handleRandomReaction(Message); // Запуск модуля
	} catch(error) {
		console.error('Ошибка в RandomReaction', error);
	}
}); 



// Логин в дискорде с помощью токена
client.login(token);