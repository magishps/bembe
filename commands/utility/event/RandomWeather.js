function listExcelFiles() {
const fs = require("fs"); // файловая система

const weatherData = './data'; // Данные о погоде

// Читаем содержимое указанной папки
fs.readdir(weatherData, (err, files) => {
    if (err) {
        // Если произошла ошибка (например, папка не найдена) — выводим её
        return console.error('Ошибка чтения папки:', err);
    }

    const excelFiles = files.filter(file => file.endsWith('.xlsx')); // Фильтруем файлы, оставляя только .xlsx

    console.log('Найденные файлы:', excelFiles); // Выводим найденные файлы
    });
}

module.exports = listExcelFiles;