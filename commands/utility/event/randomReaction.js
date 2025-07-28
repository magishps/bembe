const { Message, messageLink } = require("discord.js");

module.exports = async (Message) => {
    if (Message.author.bot) return;

    if(Math.random() < 0.2) {
        await Message.react('😺');
    }

    if(Message.content.toLowerCase().includes('магис')) {
        await Message.react('💕');
    }
};