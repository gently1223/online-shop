const express = require('express');
const router = express.Router();
const { Product } = require("../models/Product");
const multer = require('multer');

const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png' || ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
    //after getting that image from client
    // we need to save tit inside Node Server

    //Multer library

    upload(req, res, err => {
        if(err) return res.json({ success: false, err})
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename})
    })
});

router.post("/uploadProduct", auth, (req, res) => {

    //save all the data we got from the client into the DB
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return(res.status(400).json({ success: false, err}))
        return res.status(200).json({ success: true })
    })
});

router.post("/getProducts", (req, res) => {
    console.log(req)

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    
    let findArgs = {};

    console.log(req.body.filters)

    for (let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "price") {

            } else {
                findArgs[key] = req.body.filters[key];

            }
        }
    }

    Product.find(findArgs)
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if (err) return res.status(400).json({ success: false, err})
            res.status(200).json({ success: true, products, postSize: products.length })
        })
});

module.exports = router;
