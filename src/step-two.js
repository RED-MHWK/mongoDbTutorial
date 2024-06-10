import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book, Author } from './schemas/schemas_controlled.js';

dotenv.config();

// Setting the connection URL using the environment variables from the .env file
const mongoURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;

const newAuthors = [
    { name: "George Orwell", birthYear: 1903, nationality: "British" },
    { name: "Jane Austen", birthYear: 1775, nationality: "British" }
];

const newBooks = [
    { title: "1984", year: 1949 },
    { title: "Pride and Prejudice", year: 1813 }
];

async function importData() {
    try {
        const existingAuthors = await Author.find({
            name: { $in: newAuthors.map(author => author.name) }
        });

        if (existingAuthors.length > 0) {
            throw new Error('Authors already exist');
        }

        const authors = await Author.insertMany(newAuthors);

        const existingBooks = await Book.find({
            title: { $in: newBooks.map(book => book.title) }
        });

        if (existingBooks.length > 0) {
            throw new Error('Books already exist');
        }

        await Book.insertMany([
            {
                title: newBooks[0].title,
                author: authors.find(author => author.name === "George Orwell")._id,
                year: newBooks[0].year
            },
            {
                title: newBooks[1].title,
                author: authors.find(author => author.name === "Jane Austen")._id,
                year: newBooks[1].year
            }
        ]);
    } catch (err) {
        console.error('Error importing data', err);
    }
}

async function fetchData() {
    try {
        const books = await Book.find().populate('author');
        const authors = await Author.find();

        console.log('Books:', books);
        console.log('Authors:', authors);
    } catch (err) {
        console.error('Error fetching data', err);
    }
}

(async function() {
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        await importData();
        console.log('Data imported successfully');

        await fetchData();
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
    } finally {
        await mongoose.connection.close();
    }
})();
