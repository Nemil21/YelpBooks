const User = require('../models/user')
const Book = require('../models/book')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, phone, address, name } = req.body;
        const user = new User({ email, username, password, phone, address, name });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpBooks!');
            res.redirect('/books');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/books';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}

module.exports.addToChecklist = async (req, res, next) => {
    try {
        const user = res.locals.currentUser;
        const book = await Book.findById(req.params.bookId);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/books'); // Adjust the redirect path as needed
        }

        if (!book) {
            req.flash('error', 'Book not found');
            return res.redirect('/books'); // Adjust the redirect path as needed
        }

        const { date, quantity } = req.body;

        const checklistItem = {
            bookchecked: book._id,
            startDate: new Date(date),
            numberOfDays: parseInt(quantity)
        };


        user.checkList.push(checklistItem);
        await user.save();

        req.flash('success', 'Added to checklist successfully!');
        res.redirect(`/books`);
    } catch (e) {
        next(e);
    }
};

module.exports.renderChecklist = async (req, res, next) => {
    const userId = res.locals.currentUser;

    try {
        if (!userId) {
            req.flash('error', 'User not found');
            return res.redirect('/books');
        }

        const user = await User.findById(userId)
            .populate({
                path: 'checkList.bookchecked',
                model: 'Book'
            });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/books');
        }

        res.render('checklist', { user });
    } catch (err) {
        next(err);
    }
};