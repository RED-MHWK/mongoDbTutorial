import mongoose from "mongoose";

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

const Book = mongoose.model('Book', bookSchema);
const Author = mongoose.model('Author', authorSchema);

export  {Book, Author};