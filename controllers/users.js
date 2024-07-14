const User = require('../models/user')
const Book = require('../models/book')
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51PWyMyRw3hGwcyrC0h8xiEZX9Sp6Yz54ANZJUUUr1hnw0OCnne8nheovUDzwi6EwDBNfuOBCmOtD43vCg9VmIado00IeHhPEcA');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, phone, address, name } = req.body;
        const user = new User({ email, username, password, phone, address, name });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpBooks!');
            res.redirect('/books');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/books';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
};

module.exports.addToChecklist = async (req, res, next) => {
    try {
        const user = res.locals.currentUser;
        const book = await Book.findById(req.params.bookId);
        let bookQuantity = book.quantity;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use true for port 465, false for all other ports
            auth: {
              user: "gamingsamarth@gmail.com",
              pass: "ltpu aktw lqjb kfqo",
            },
          });  
const mailOptions= {
    // send mail with defined transport object
      from:{
        name: "Samarth",
        address: "gamingsamarth@gmail.com"
      }, // sender address
      to: [user.email], // list of receivers
      subject: "Book borrowed", // Subject line
      text: `${book.title} is borrowed`, // plain text body
      html: `<b>${book.title} is borrowed</b>`, // html body
    };
    sendMail = async (transport,mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log("mail is sent")
        } catch (error) {
            console.error(error);
        }
    }   

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/books');
        }

        if (!book) {
            req.flash('error', 'Book not found');
            return res.redirect('/books');
        }

        const { date, quantity, stripeToken } = req.body;

        const pricePerDay = book.price;
        const totalPrice = pricePerDay * parseInt(quantity);

        try {
            await stripe.charges.create({
                amount: totalPrice * 100,
                currency: 'usd',
                description: 'Book rental charge',
                source: stripeToken,
            });
            req.flash('success', 'Payment Successful');
        } catch (error) {
            console.log(error);
            req.flash('error', 'Payment failed');
            return res.redirect('/books');
        }

        const checklistItem = {
            bookchecked: book._id,
            startDate: new Date(date),
            numberOfDays: parseInt(quantity),
        };

        await book.updateOne({ quantity: bookQuantity - 1 });
        user.checkList.push(checklistItem);
        await book.save();
        await user.save();
        sendMail(transporter,mailOptions);
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
                model: 'Book',
            });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/books');
        }

        res.render('users/checklist', { user });
    } catch (err) {
        next(err);
    }
};