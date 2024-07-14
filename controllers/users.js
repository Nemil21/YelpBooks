const User = require('../models/user')
const Furniture = require('../models/furniture')

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
            req.flash('success', 'Welcome to YelpFurniture!');
            res.redirect('/furnitures');
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
    const redirectUrl = res.locals.returnTo || '/furnitures';
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
        const furniture = await Furniture.findById(req.params.furnitureId);
        
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/furnitures'); // Adjust the redirect path as needed
        }

        if (!furniture) {
            req.flash('error', 'Furniture not found');
            return res.redirect('/furnitures'); // Adjust the redirect path as needed
        }

        const { date, quantity } = req.body;

        const checklistItem = {
            furniturechecked: furniture._id, 
            startDate: new Date(date),
            numberOfDays: parseInt(quantity)
        };
        

        user.checkList.push(checklistItem);
        await user.save();

        req.flash('success', 'Added to checklist successfully!');
        res.redirect(`/furnitures`); 
    } catch (e) {
        next(e);
    }
};


module.exports.renderChecklist = async (req, res, next) => {
    const userId = res.locals.currentUser; 

    try {
        if (!userId) {
            req.flash('error', 'User not found');
            return res.redirect('/furnitures'); 
        }

      
        const user = await User.findById(userId)
            .populate({
                path: 'checkList.furniturechecked',
                model: 'Furniture'
            });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/furnitures'); 
        }

       
        res.render('checklist', { user }); 
    } catch (err) {
        next(err);
    }
};
