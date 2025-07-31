const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Чтение Excel файлов
function listExcelFiles() {
  const weatherData = path.join(__dirname, '../../../data');
  fs.readdir(weatherData, (err, files) => {
    if (err) return console.error('Ошибка чтения папки:', err);
    const excelFiles = files.filter(file => file.endsWith('.xlsx') && !file.startsWith('~$'));
    console.log('Найденные погодные файлы:', excelFiles);
  });
}

// Прогноз на 30 дней
function getMonthlyForecast(season) {
  const filePath = path.resolve(__dirname, '../../../data', `${season}.xlsx`);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  let forecast = '📅 Погода на 30 дней:\n';

  for (let day = 1; day <= 30; day++) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const entry = data.find(row => Number(row.d20) === roll);

    if (entry) {
      forecast += `${day}. ${entry.Погода} — ${entry.Эффекты}\n`;
    } else {
      forecast += `${day}. ❓ d20 = ${roll} — не найдено\n`;
    }
  }

  return forecast;
}

module.exports = {
  listExcelFiles,
  getMonthlyForecast
};
