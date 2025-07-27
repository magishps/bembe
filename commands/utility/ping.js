const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('ПОНГ!'),

	async execute(Interaction) {
		await Interaction.reply('ПОНГ!');
	},
};

