const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require('discord.js');
const GIFEncoder = require('gif-encoder-2/src/GIFEncoder');
const Jimp = require('jimp'); // <-- Важно!
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Конвертируйте любое изображение в GIF!')
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('Изображение для конвертации')
                .setRequired(true)
        ),

    async execute(Interaction) {
        const attachment = Interaction.options.getAttachment('image');

        try {

            await Interaction.deferReply() // ОТКЛАДЫВАЕМ ЕБУЧИЙ ОТВЕТ
            // Скачиваем файл
            const response = await fetch(attachment.url);
            const buffer = Buffer.from(await response.arrayBuffer());

            // Jimp
            const image = await Jimp.read(buffer);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            // Gif
            const encoder = new GIFEncoder(width, height);
            const gifChunks = [];

            const stream = encoder.createReadStream();
            stream.on('data', chunk => gifChunks.push(chunk));
            stream.on('end', async () => {
                const gifBuffer = Buffer.concat(gifChunks);
                const gifAttachment = new AttachmentBuilder (gifBuffer, { name: 'converted.gif'});
                
                await Interaction.editReply({
                    content: "Вот твой GIF",
                    files: [gifAttachment],
                });
            });
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(500);
            encoder.setQuality(10);

            encoder.addFrame(image.bitmap.data);
            encoder.finish();

            await Interaction.editReply('Конвертирую изображение...');

        } catch (err) {
            console.error(err);
            await Interaction.editReply({ content: 'Ошибка при конвертации изображения', flags: MessageFlags.Ephemeral });
        }
    },
};