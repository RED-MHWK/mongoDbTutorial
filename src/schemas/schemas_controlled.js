
import mongoose from "mongoose";

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

export { Author, Book };