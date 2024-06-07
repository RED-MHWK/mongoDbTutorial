import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log(`Username: ${process.env.MONGO_INITDB_ROOT_USERNAME}`);
console.log(`Password: ${process.env.MONGO_INITDB_ROOT_PASSWORD}`);
console.log(`Database: ${process.env.MONGO_DB_NAME}`);

//setting the connection url using the environment variables from .env file
const mongoURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;

// Author Schema
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthYear: Number,
    nationality: String
});

const Author = mongoose.model('Author', authorSchema);

// Book Schema with reference to Author
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    year: Number
});

const Book = mongoose.model('Book', bookSchema);

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

        if (existingAuthors.length) {
            throw new Error('Authors already exist');
        }

        const authors = await Author.insertMany(newAuthors);

        const existingBooks = await Book.find({
            title: { $in: newBooks.map(book => book.title) }
        });

        if (existingBooks.length) {
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
        await mongoose.connect(mongoURL);
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
