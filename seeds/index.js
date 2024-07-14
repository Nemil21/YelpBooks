const mongoose = require('mongoose');
const axios = require('axios');
const Book = require('../models/book');
const isbns = require('./isbns');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb+srv://pranshu05patel:PbsHmDwhVJ5FmuhJ@cluster0.8udh8o7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Mongo Connection Open!!");
}

const uniqueIsbns = Array.from(new Set(isbns.map(item => item.isbn)));

const seedDB = async () => {
    try {
        await Book.deleteMany({});

        for (const isbn of uniqueIsbns) {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = response.data;

            if (data.totalItems > 0) {
                const bookData = data.items[0].volumeInfo;
                const book = new Book({
                    title: bookData.title,
                    description: bookData.description ? bookData.description : 'No description available',
                    isbn: isbn,
                    images: bookData.imageLinks ? [{ url: bookData.imageLinks.thumbnail, filename: 'thumbnail' }] : [],
                    price: Math.floor(Math.random() * 100) + 10,
                    publishDate: bookData.publishedDate ? new Date(bookData.publishedDate) : new Date(),
                    author: bookData.authors ? bookData.authors[0] : 'Unknown',
                    quantity: Math.floor(Math.random() * 10),
                    printType: bookData.printType,
                    categories: bookData.categories ? bookData.categories : [],
                    pageCount: bookData.pageCount,
                    language: bookData.language,
                });
                await book.save();
                console.log(`Saved book with ISBN: ${isbn}`);
            } else {
                console.log(`No book found for ISBN: ${isbn}`);
            }
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

seedDB().then(() => mongoose.connection.close());