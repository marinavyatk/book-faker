const express = require('express');
const cors = require('cors');
const seedrandom = require('seedrandom');
const {Faker, en, de, ja} = require('@faker-js/faker');

const app = express();
const PORT = 4000;

app.use(cors());

const safeCall = (fn, fallback) => {
    try {
        const result = fn();
        return result ?? fallback;
    } catch {
        return fallback;
    }
};

app.get('/api/books', (req, res) => {
    const {
        seed ,
        page ,
        locale ,
        likes ,
        reviews ,
        booksPerPage,
    } = req.query;
    const seedNumber = Number(String(seed)+ page);
    const random = () => seedrandom(seedNumber);
    const localeMap = {en, de, ja};
    const selectedLocale = localeMap[locale] || en;
    const faker = new Faker({locale: selectedLocale, seed: seedNumber});

    const generateCount = (avg) => {
        const base = Math.floor(avg);
        const fractional = avg - base;
        return base + (random() < fractional ? 1 : 0);
    };

    const getRandomReviews = (count) => {
        const reviews = [];
        for (let i = 0; i < count; i++) {
            reviews.push({
                author: faker.person.fullName(),
                content: faker.lorem.sentence()
            });
        }
        return reviews;
    };


    const getBooks = (locale) => {
        return Array.from({length: booksPerPage}, (_, i) => {
            const idx = (page - 1) * booksPerPage + i + 1;

            const isEng = locale === 'en'
            const generateTitleAlternative = () => {
               const title = faker.word.words({count: {min: 2, max: 5}})
              return  title.charAt(0).toUpperCase() + title.slice(1)
            }

            const book = {
                index: idx,
                isbn: safeCall(() => faker.commerce.isbn(), '000-0-00-000000-0'),
                title: safeCall(() =>isEng ? faker.book.title() : generateTitleAlternative(), faker.lorem.words(3)),
                author: faker.person.fullName(),
                publisher: isEng ? faker.book.publisher() : faker.company.name(),
                likes: generateCount(parseFloat(likes)),
                reviews: getRandomReviews(generateCount(parseFloat(reviews))),
                coverUrl: `https://picsum.photos/seed/${seed}-${page}-${i}/200/300`
            };

            return book;
        });
    };

    res.json({books: getBooks(locale)});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
