const { SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
	    .setName('dev')
		.setDescription('Мой создатель'),

	async execute(Interaction) {
		await Interaction.reply('Он создал меня: magishps');
	},
};

