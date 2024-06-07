import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Book, Author} from './schemas/schemas_controlled.js';
dotenv.config();

//setting the connection url using the environment variables from .env file
const mongoURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;

const newYear = 1952;


async function checkAndUpdateReleaseYear() {
    try {
        // Finde das Buch "The Catcher in the Rye"
        const catcherInTheRye = await Book.findOne({ title: "The Catcher in the Rye" });

        // Überprüfe, ob das Erscheinungsjahr korrekt ist
        if (catcherInTheRye.year === newYear) {
            console.log('Das Erscheinungsjahr von "The Catcher in the Rye" ist bereits korrekt.');
        } else {
            // Aktualisiere das Erscheinungsjahr auf 1952
            catcherInTheRye.year = newYear;
            await catcherInTheRye.save();
            console.log('Das Erscheinungsjahr von "The Catcher in the Rye" wurde erfolgreich aktualisiert.');
        }
    } catch (err) {
        console.error('Fehler beim Überprüfen und Aktualisieren des Erscheinungsjahres:', err);
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

        await checkAndUpdateReleaseYear();
        console.log('Data imported successfully');

        await fetchData();
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
    } finally {
        await mongoose.connection.close();
    }
})();