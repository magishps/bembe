const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Узнайте информацию о сервере'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`Это сервер ${interaction.guild.name} и на нём ${interaction.guild.memberCount} человек`);
	},
};