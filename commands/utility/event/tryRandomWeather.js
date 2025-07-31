const { Client, channelId, getSeasonFromMonth, getMonthlyForecast } = require('discord.js');

async function trySendForecastByLastMessage(client, channelId, getSeasonFromMonth, getMonthlyForecast) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      console.error('Канал не найден или не текстовый.');
      return;
    }

    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();

    if (lastMessage && lastMessage.author.id === client.user.id) {
      const sentDate = lastMessage.createdAt;
      console.log(`Последнее сообщение от бота: ${sentDate}`);
      if (sentDate.getMonth() === currentMonth && sentDate.getFullYear() === currentYear) {
        console.log('Прогноз уже отправлен в этом месяце.');
        return;
      }
    }

    const season = getSeasonFromMonth(currentMonth);
    const forecast = getMonthlyForecast(season);
    await channel.send(forecast);
    console.log('Прогноз отправлен.');

  } catch (error) {
    console.error('Ошибка при отправке прогноза:', error);
  }
}

module.exports = { trySendForecastByLastMessage };

