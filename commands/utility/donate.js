const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
	    .setName('donate')
	    .setDescription('На PICUN F6🎧'),

	async execute(Interaction) {
		await Interaction.reply('[Освободить меня](https://www.donationalerts.com/r/magishps5)');
	},
};