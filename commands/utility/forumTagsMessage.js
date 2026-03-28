const { ChannelType } = require('discord.js');

module.exports = {
    name: 'forumtags',
    description: 'Показывает статистику всех тегов форума',
    async execute(message, args) {
        const CHANNEL_ID = '1334693268159594576';
        const channel = await message.guild.channels.fetch(CHANNEL_ID);

        if (!channel || channel.type !== ChannelType.GuildForum) {
            await message.reply("❌ Это не канал-форум или канал не найден.");
            return;
        }

        const tagCounts = new Map();

        // ID → имя тега
        const tagMap = new Map(channel.availableTags.map(tag => [tag.id, tag.name]));

        const countTags = (thread) => {
            thread.appliedTags.forEach(tagId => {
                const tagName = tagMap.get(tagId);
                if (tagName) {
                    tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);
                }
            });
        };

        try {
            // 🟢 Активные ветки
            const activeThreads = await channel.threads.fetchActive();
            activeThreads.threads.forEach(thread => countTags(thread));

            // 📦 ВСЕ архивированные (пагинация)
            let lastId;
            let hasMore = true;

            while (hasMore) {
                const archived = await channel.threads.fetchArchived({
                    limit: 100,
                    before: lastId
                });

                archived.threads.forEach(thread => countTags(thread));

                hasMore = archived.hasMore;
                lastId = archived.threads.last()?.id;

                // ⏳ маленькая задержка (анти rate limit)
                await new Promise(r => setTimeout(r, 300));
            }

        } catch (error) {
            console.error("Ошибка при получении веток форума:", error);
            await message.reply("❌ Не удалось прочитать все ветки форума. Проверьте права бота.");
            return;
        }

        if (tagCounts.size === 0) {
            await message.reply("ℹ️ Теги в этом форуме пока не применялись.");
            return;
        }

        // 📊 Сортировка
        const sortedTags = [...tagCounts.entries()]
            .sort((a, b) => b[1] - a[1]);

        let replyMessage = '--- Статистика тегов ---\n';
        sortedTags.forEach(([tag, count]) => {
            replyMessage += `${tag}: ${count}\n`;
        });

        await message.reply(`\`\`\`\n${replyMessage}\`\`\``);
    },
};