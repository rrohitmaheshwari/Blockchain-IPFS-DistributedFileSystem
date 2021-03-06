const ipfsAPI = require('ipfs-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('config');
const {isLoggedIn} = require('../lib/isLoggedIn')
const logger = require('../config/logger')


const express = require('express');
const router = express.Router();

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({storage});

const ipfs = ipfsAPI(config.ipfs_config);

var blocksCtrl = require('../blockchain/blocksController');

/*  upload POST endpoint */
router.post('/upload', isLoggedIn, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(422).json({
            error: 'File needs to be provided.',
        });
    }

    const mime = req.file.mimetype;
    if (mime.split('/')[0] !== 'image') {
        fs.unlink(req.file.path);

        return res.status(422).json({
            error: 'File needs to be an image.',
        });
    }

    const fileSize = req.file.size;
    if (fileSize > MAX_SIZE) {
        fs.unlink(req.file.path);

        return res.status(422).json({
            error: `Image needs to be smaller than ${MAX_SIZE} bytes.`,
        });
    }

    const data = fs.readFileSync(req.file.path);
    ipfs.add(data, (err, files) => {
        fs.unlink(req.file.path);
        if (files) {


            let transaction = {
                'senderEmail': req.session.email,
                'receiverEmail': req.body.receiverEmail,
                'fileHash': files[0].hash,
                'timeStamp': new Date()
            };

            //save to blockchain

            blocksCtrl.blockchain_upload(transaction).then(() => {

                return res.json({
                    msg: 'Data has been uploaded!',
                });
            }).catch((err) => {
                console.log(err);
                return res.status(500).json({
                    error: err,
                });
            });

        }


    });
});

/*  upload GET endpoint. */
router.get('/', function (req, res, next) {
    res.send('Upload endpoint!');
});


/*  upload GET endpoint. */
router.get('/readFiles', isLoggedIn, function (req, res) {
    blocksCtrl.blockchain_read().then((result) => {


        let response = result.data;
        let transaction = result.transaction;


        let responseData = [];


        for (let i = 0; i < transaction.length; i++) {

            if (transaction[i].senderEmail === req.session.req.session.email || transaction[i].receiverEmail === req.session.req.session.email) {
                responseData.push(transaction[i]);
            }

        }


        for (let i = 1; i < response.length; i++) {

            let blockdata = JSON.parse(response[i].data);
            for (let j = 0; j < blockdata.length; j++) {


                if (blockdata[j].senderEmail === req.session.email || blockdata[j].receiverEmail === req.session.email) {
                    responseData.push(blockdata[j]);
                }

            }

        }

        res.status(200);
        res.send({data: responseData});
    }).catch((err) => {
        console.log(err);
    });

});

module.exports = router;
