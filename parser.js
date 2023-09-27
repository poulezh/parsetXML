const fs = require('fs');
const xml2js = require('xml2js');

const num = '1 (4)';
const file = `./xml/preview_hall_${num}.xml`;
const resultFile = `./result/preview_hall_${num}.xml`;

fs.readFile(`${file}`, 'utf-8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения файла:', err);
    return;
  }

  xml2js.parseString(data, (parseErr, result) => {
    if (parseErr) {
      console.error('Ошибка парсинга XML:', parseErr);
      return;
    }

    const convertToInteger = (str) => {
      // Удаляем все символы после точки и преобразовываем в целое число
      return parseInt(str.split('.')[0], 10);
    };

    const levels = result.XML.Data[0].Theatres[0].Theatre[0].Halls[0].Hall[0].Levels[0].Level[0].Places;
    const places = result.XML.Data[0].Theatres[0].Theatre[0].Halls[0].Hall[0].Levels[0].Level[0].Places[0].Place;

    levels.forEach(level => {
      level.$.Width = convertToInteger(level.$.Width);
      level.$.Height = convertToInteger(level.$.Height);
    })


    places.forEach(place => {
      place.$.ID = convertToInteger(place.$.ID);
      place.$.Row = convertToInteger(place.$.Row);
      place.$.Place = convertToInteger(place.$.Place);
      place.$.X = convertToInteger(place.$.X);
      place.$.Y = convertToInteger(place.$.Y);
      place.$.Width = convertToInteger(place.$.Width);
      place.$.Height = convertToInteger(place.$.Height);
      place.$.Type = convertToInteger(place.$.Type);
    });

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(result);

    fs.writeFile(`${resultFile}`, xml, (writeErr) => {
      if (writeErr) {
        console.error('Ошибка записи файла:', writeErr);
        return;
      }
      console.log('Числа успешно преобразованы в целые числа и записаны в файл.');
    });
    
  });
});