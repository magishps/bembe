const { PermissionsBitField } = require("discord.js");

// Константы для твоего бота
const LOG_USER_ID = "713443075405643847"; // ID администратора для логов
const allowedUserIDs = ["277514125238730753", "740863976170192916", "713443075405643847"]; // кто может использовать команду

module.exports = async (Message) => {
    if (Message.author.bot) return;
    const content = Message.content.toLowerCase();

    // Получаем пользователя для логов
    const logUser = await Message.client.users.fetch(LOG_USER_ID).catch(() => null);

    // --- Снятие всех таймаутов через ЛС ---
    if (Message.channel.isDMBased() && allowedUserIDs.includes(Message.author.id)) {
        if (content === "снять таймауты") {
            let totalRemoved = 0;
            let totalFailed = 0;

            for (const guild of Message.client.guilds.cache.values()) {
                try {
                    // Проверяем, есть ли у бота права
                    const botMember = await guild.members.fetchMe();
                    if (!botMember.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        if (logUser) await logUser.send(`❌ У меня нет права Moderate Members на сервере ${guild.name}`);
                        continue;
                    }

                    // Загружаем всех участников
                    const members = await guild.members.fetch();
                    for (const member of members.values()) {
                        const hasTimeout = member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now();
                        if (hasTimeout) {
                            console.log(`Пытаемся снять таймаут у ${member.user.tag} на сервере ${guild.name}`);

                            if (!member.moderatable) {
                                totalFailed++;
                                console.log(`❌ Не могу снять таймаут у ${member.user.tag} (роль выше бота)`);
                                if (logUser) await logUser.send(`❌ Не удалось снять таймаут у ${member.user.tag} на сервере ${guild.name} (роль выше бота)`);
                                continue;
                            }

                            try {
                                await member.timeout(null, `Снято ${Message.author.tag} через ЛС`);
                                totalRemoved++;
                                console.log(`✅ Таймаут снят у ${member.user.tag}`);

                                if (logUser) {
                                    await logUser.send(`✅ Таймаут у ${member.user.tag} был снят пользователем ${Message.author.tag} на сервере ${guild.name}`);
                                }
                            } catch (err) {
                                totalFailed++;
                                console.error(`Ошибка при снятии таймаута у ${member.user.tag}:`, err);
                                if (logUser) await logUser.send(`❌ Ошибка при снятии таймаута у ${member.user.tag}: ${err.message}`);
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Ошибка при обработке сервера ${guild.name}:`, err);
                    if (logUser) await logUser.send(`❌ Ошибка при обработке сервера ${guild.name}: ${err.message}`);
                }
            }

            return Message.author.send(`✅ Таймаутов снято: ${totalRemoved}, не удалось: ${totalFailed}`).catch(() => {});
        }
    }

    // --- Команда "2 недели" для выдачи таймаута ---
    if (content.includes("две недели") && Message.mentions.members.size > 0) {    
        if (!allowedUserIDs.includes(Message.author.id)) {
            return Message.author.send("").catch(() => {});
        }

        const memberToTimeout = Message.mentions.members.first();
        const duration = 2 * 60 * 1000; // 2 минуты

        if (!Message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return Message.author.send("❌ У меня нет прав для выдачи таймаута!").catch(() => {});
        }

        if (!memberToTimeout.moderatable) {
            return Message.author.send("❌ Я не могу выдать таймаут этому пользователю (роль выше бота)").catch(() => {});
        }

        try {
            await memberToTimeout.timeout(duration, `Фраза '2 недели' — таймаут выдан ${Message.author.tag}`);
            await Message.author.send(`⏳ ${memberToTimeout.user.tag} получил таймаут на 2 минуты!`).catch(() => {});

            if (Message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await Message.delete().catch(() => {});
            }

            if (logUser) {
                await logUser.send(`⏳ ${Message.author.tag} выдал таймаут ${memberToTimeout.user.tag} на 2 минуты`);
            }
        } catch (err) {
            console.error("Ошибка при выдаче таймаута:", err);
            await Message.author.send("❌ Не удалось выдать таймаут. Проверь права бота и иерархию ролей.").catch(() => {});
        }
    }
};
