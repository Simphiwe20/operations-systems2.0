const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
// const config = require("config");
const multer = require("multer");
const { Readable } = require("stream");
const File = require("../Models/file");
const archiver = require('archiver')
let bucket

mongoose.connection.on("open", () => {
    console.log('COONECTION RUNNING')
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
})

module.exports = {
    uploadDocument: async (req, res) => {
        let { file } = req
        console.log(file)

        let { fieldname, originalname, mimetype, buffer } = file
        console.log("FILE: ", file)
        let newFile = new File({
            filename: file.originalname,
            contentType: mimetype,
            length: buffer.length,
        })


        try {
            let uploadStream = bucket.openUploadStream(fieldname)
            let readBuffer = new Readable()
            readBuffer.push(buffer)
            readBuffer.push(null)


            const isUploaded = await new Promise((resolve, reject) => {
                readBuffer.pipe(uploadStream)
                    .on("finish", resolve("successfull"))
                    .on("error", reject("error occured while creating stream"))
            })


            newFile.id = uploadStream.id
            let savedFile = await newFile.save()
            if (!savedFile) {
                return res.status(404).send("error occured while saving our work")
            }
            return res.send({ file: savedFile, message: "Policy uploaded successfully" })
        }
        catch (err) {
            res.send("error uploading file")
        }

    },
    getAllFile: async (req, res) => {
        console.log("getAllFile: ")

        const files = bucket.find({})

        files.forEach(file => {
            console.log('FILE: ', file)
            return res.status(200).json({
                sucess: false,
                file: { ...file }
            })

        })
    },
    getFile: async (req, res) => {
        console.log('getFile: ', req.body)
        let { fileId } = req.body

        let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))

        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType)
        })
        downloadStream.pipe(res)
    },
    getDocs: async (req, res) => {
        try {
            const files = await bucket.find().toArray();
            if (files.length === 0) {
                return res.status(404).json({ error: { text: "No files found" } });
            }
            res.set("Content-Type", "application/zip");
            res.set("Content-Disposition", `attachment; filename=files.zip`);
            res.set("Access-Control-Allow-Origin", "*");

            res.send(files)
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: { text: `Unable to download files`, error },
            });
        }
    }
}