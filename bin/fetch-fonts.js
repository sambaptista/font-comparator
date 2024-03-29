const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const apiKey = config.apiKey;

const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&capability=WOFF2`;
const destination = path.resolve(__dirname, '../src/assets');

const attributesWhitelist = ['family', 'category', 'variants'];

axios
    .get(apiUrl)
    .then(response => {
        const fonts = response.data.items;
        const categories = {};
        // const subsets = {};

        const filteredFonts = fonts.map(font => {
            const filteredFont = {};
            categories[font.category] = true;
            // font.subsets.forEach(s => subsets[s] = true);

            for (const attribute of attributesWhitelist) {
                filteredFont[attribute] = font[attribute];
            }

            return filteredFont;
        });


        const fontsContent =  JSON.stringify(filteredFonts, null, 2).replace(/[\t\n]| {2}/g, '');
        fs.writeFile(path.join(destination, 'fonts.json'), fontsContent, err => {
            if (err) {
                console.error('Error when writing file', err);
            } else {
                console.log('File generation successfull');
            }
        });

        fs.writeFile(path.join(destination, 'categories.json'), JSON.stringify(Object.keys(categories), null, 2), err => {
            if (err) {
                console.error('Error when writing file', err);
            } else {
                console.log('File generation successfull');
            }
        });

        // fs.writeFile(path.join(destination, 'subsets.json'), JSON.stringify(subsets, null, 2), err => {
        // if (err) {
        //     console.error('Error when writing file', err);
        // } else {
        //     console.log('File generation successfull');
        // }
        // });
    })
    .catch(error => {
        console.error('Il y a eu une erreur lors de la récupération des données de Google Fonts', error);
    });
