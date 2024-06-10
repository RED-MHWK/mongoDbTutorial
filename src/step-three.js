import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book, Author } from './schemas/schemas_controlled.js';
dotenv.config();

// Setting the connection URL using the environment variables from the .env file
const mongoURL = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;

const newYear = 1952;

async function checkAndUpdateReleaseYear() {
    try {
        // Finde das Buch "The Catcher in the Rye"
        const catcherInTheRye = await Book.findOne({ title: "The Catcher in the Rye" });

        if (!catcherInTheRye) {
            console.log(`The Book "${catcherInTheRye.title}" could not be found.`);
            return;
        }

        // Überprüfe, ob das Erscheinungsjahr korrekt ist
        if (catcherInTheRye.year === newYear) {
            console.log(`The release date of "${catcherInTheRye.title}" is already set correctly.`);
        } else {
            // Finde den Autor "J.D. Salinger"
            const author = await Author.findOne({ name: "J.D. Salinger" });

            if (!author) {
                console.log('The requested Author could not be found.');
                return;
            }

            // Aktualisiere das Erscheinungsjahr und den Autor des Buches
            catcherInTheRye.year = newYear;
            catcherInTheRye.author = author._id;
            await catcherInTheRye.save();
            console.log(`The release date of "${catcherInTheRye.title}" was updated successfully.`);
        }
    } catch (err) {
        console.error('Error while checking the release date:', err);
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

        await checkAndUpdateReleaseYear();
        console.log('Data imported successfully');

        await fetchData();
    } catch (err) {
        console.error('Could not connect to MongoDB', err);
    } finally {
        await mongoose.connection.close();
    }
})();
