const Furniture = require('../models/furniture')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = 'pk.eyJ1IjoibmVtaWxzaGFoIiwiYSI6ImNsd2Vva212MDE4djMyaWxkamx1emE2MG4ifQ.8i9uhpSxwWZo--UPI90rSA';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
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

    const totalItems = await Furniture.countDocuments(query);
    const furnitures = await Furniture.find(query);
    const paginatedFurnitures = await Furniture.find(query).limit(limit).skip(startIndex);

    if (furnitures.length < 1) {
        req.flash('error', 'Cannot find that furniture shop!');
        return res.redirect('/furnitures');
    }

    const pagination = {};
    if (startIndex > 0) {
        pagination.previous = page - 1;
    }
    if (startIndex + limit < totalItems) {
        pagination.next = page + 1;
    }

    res.render('furnitures/index', {
        furnitures,
        paginatedFurnitures,
        pagination,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        search: search || ''
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('furnitures/new')
}

module.exports.createFurniture = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.furniture.location,
        limit: 1
    }).send()

    const furniture = new Furniture(req.body.furniture);
    furniture.geometry = geoData.body.features[0].geometry
    furniture.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    furniture.author = req.user._id;
    await furniture.save();
    console.log(furniture)
    req.flash('success', 'Successfully made a new furniture sale!')
    res.redirect(`furnitures/${furniture._id}`);

}

module.exports.showFurniture = async (req, res) => {
    const { id } = req.params;
    const furniture = await Furniture.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!furniture) {
        req.flash('error', 'Cannot find that furniture!')
        return res.redirect('/furnitures');
    }
    res.render('furnitures/show', { furniture })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const furniture = await Furniture.findById(id);
    if (!furniture) {
        req.flash('error', 'Cannot find that furniture!')
        return res.redirect('/furnitures');
    }
    res.render('furnitures/edit', { furniture })
}

module.exports.updateFurniture = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const furniture = await Furniture.findByIdAndUpdate(id, { ...req.body.furniture })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    furniture.images.push(...imgs)
    await furniture.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await furniture.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated a furniture!')
    res.redirect(`/furnitures/${furniture.id}`);
}

module.exports.deleteFurniture = async (req, res) => {
    const { id } = req.params
    await Furniture.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted furniture!')
    res.redirect('/furnitures');
}