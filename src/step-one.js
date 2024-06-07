import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log(`Username: ${process.env.MONGO_INITDB_ROOT_USERNAME}`);
console.log(`Password: ${process.env.MONGO_INITDB_ROOT_PASSWORD}`);
console.log(`Database: ${process.env.MONGO_DB_NAME}`);

//setting the connection url using the environment variables from .env file
const mongoURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;



//creating our test schemas which predefine the type of variables we'll insert later
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number
});

const authorSchema = new mongoose.Schema({
    name: String,
    birthYear: Number,
    nationality: String
});



//defining our models applying our schemas and give them a name
const Book = mongoose.model('Book', bookSchema);
const Author = mongoose.model('Author', authorSchema);

async function importData() {
    try {
        await Book.deleteMany({});
        await Author.deleteMany({});
//deleting existing data to impede duplicates for tutorial reasons


        await Book.insertMany([
            {
                "title": "The Catcher in the Rye",
                "author": "J.D. Salinger",
                "year": 1951
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "year": 1960
            }
        ]);
//taking our model which is predefined by the schema and insert more than one document into model books



        await Author.insertMany([
            {
                "name": "J.D. Salinger",
                "birthYear": 1919,
                "nationality": "American"
            },
            {
                "name": "Harper Lee",
                "birthYear": 1926,
                "nationality": "American"
            }
        ]);
//taking our model which is predefined by the schema and insert more than one document into model authors



    } catch (err) {
        console.error('Error importing data', err);
    }
}


//fetching our models and display their content to check for errors and complete little tutorial loop
async function fetchData() {
    try {
        const books = await Book.find();
        const authors = await Author.find();

        console.log('Books:', books);
        console.log('Authors:', authors);
    } catch (err) {
        console.error('Error fetching data', err);
    }
}


//connect, import, fetch and close function orchestrating the tutorial loop
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
