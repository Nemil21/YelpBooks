const Book = require('../models/book')
const { cloudinary } = require('../cloudinary');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.index = async (req, res) => {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const startIndex = (page - 1) * limit;
    const regex = search ? new RegExp(escapeRegex(search), "gi") : null;

    let query = {};
    if (regex) {
        query = {
            $or: [
                { title: regex },
                { description: regex },
                { location: regex },
                { itemTypes: regex }
            ]
        };
    }

    const totalItems = await Book.countDocuments(query);
    const books = await Book.find(query);
    const paginatedBooks = await Book.find(query).limit(limit).skip(startIndex);

    if (books.length < 1) {
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/books');
    }

    const pagination = {};
    if (startIndex > 0) {
        pagination.previous = page - 1;
    }
    if (startIndex + limit < totalItems) {
        pagination.next = page + 1;
    }

    res.render('books/index', {
        books,
        paginatedBooks,
        pagination,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        search: search || ''
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('books/new')
}

module.exports.createBook = async (req, res, next) => {
    const book = new Book(req.body.book);
    book.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await book.save();
    req.flash('success', 'Successfully made a new book sale!')
    res.redirect(`books/${book._id}`);

}

module.exports.showBook = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!book) {
        req.flash('error', 'Cannot find that book!')
        return res.redirect('/books');
    }
    res.render('books/show', { book })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
        req.flash('error', 'Cannot find that book!')
        return res.redirect('/books');
    }
    res.render('books/edit', { book })
}

module.exports.updateBook = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    book.images.push(...imgs)
    await book.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await book.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated a book!')
    res.redirect(`/books/${book.id}`);
}

module.exports.deleteBook = async (req, res) => {
    const { id } = req.params
    await Book.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted book!')
    res.redirect('/books');
}