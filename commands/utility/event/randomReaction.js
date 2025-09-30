const { Message, messageLink } = require("discord.js");

module.exports = async (Message) => {
    if (Message.author.bot) return;

    if(Math.random() < 0.002) {
        await Message.react('😺');
    }

    if(Message.content.toLowerCase().includes('магис')) {
        await Message.react('💕');
    }

    if (Message.content.toLowerCase().includes('эдик')) {
        await Message.react('🏳️‍🌈');
    }
    
    if (Message.content.toLowerCase().includes('овца')) {
        await Message.react('🐑');
    }
};