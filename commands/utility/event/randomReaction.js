const { PermissionsBitField } = require("discord.js");

module.exports = async (Message) => {
    if (Message.author.bot) return;

    // --- Случайная реакция с котиком ---
    if (Math.random() < 0.002) {
        await Message.react('😺');
    }

    // --- Простые реакции по словам ---
    const content = Message.content.toLowerCase();

    if (content.includes('магис')) {
        await Message.react('💕');
    }

    if (content.includes('эдик')) {
        await Message.react('🏳️‍🌈');
    }

    if (content.includes('овца')) {
        await Message.react('🐑');
    }

    // --- Команда "2 недели" ---
    if (content.includes("двe недели") && Message.mentions.members.size > 0) {
        // Список разрешённых пользователей по ID
        const allowedUserIDs = ["277514125238730753", "740863976170192916", "713443075405643847"]; // вставь ID пользователей

        if (!allowedUserIDs.includes(Message.author.id)) {
            return Message.author.send("❌ Ты не можешь использовать эту команду.").catch(() => {});
        }

        const memberToTimeout = Message.mentions.members.first();
        const duration = 2 * 60 * 1000; // 2 минуты

        // Проверка прав бота
        if (!Message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return Message.author.send("❌ У меня нет прав для выдачи таймаута!").catch(() => {});
        }

        if (!memberToTimeout.moderatable) {
            return Message.author.send("❌ Я не могу выдать таймаут этому пользователю (возможно, у него роль выше моей).").catch(() => {});
        }

        try {
            await memberToTimeout.timeout(duration, "Фраза '2 недели' — автоматический таймаут на 2 минуты");
            await Message.author.send(`⏳ ${memberToTimeout.user.tag} получил таймаут на 2 минуты!`).catch(() => {});

            // --- Удаляем сообщение, которое вызвало команду ---
            if (Message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await Message.delete().catch(err => console.error("Не удалось удалить сообщение:", err));
            }

        } catch (err) {
            console.error("Ошибка при выдаче таймаута:", err);
            await Message.author.send("❌ Не удалось выдать таймаут. Проверь права бота и иерархию ролей.").catch(() => {});
        }
    }
};
