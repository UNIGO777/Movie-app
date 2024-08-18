const fs = require('fs');
const path = require('path');

const Director = require('../model/directorModel');
const Movie = require('../model/movieModel');
const Series = require('../model/seriesModel');
const uploadImage = require('../utils/upload');
const { createDirectorValidation, editDirectorValidation } = require('../validation/directorValidation');


//! config uploader
const upload = uploadImage({
    fieldName: "profile",
    fileSize: "4000000",
    destination: '../public/director/',
    width: 600,
    height: 600,
    quality: 80
});




exports.getAllDirectors = async (req, res) => {
    try {
        const directors = await Director.find();
        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            results: directors.length,
            directors
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
};

exports.getDirector = async (req, res) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) return res.status(404).json({ status: 404, message: "Director not found" });

        // const movies = await Movie.find({ director: director._id })
        //     .limit(12)
        //     .select("title thumbnail views duration ");
        // const series = await Series.find({ director: director._id })
        //     .limit(12)
        //     .select("title thumbnail views duration ");

        const movies = await Movie.aggregate([
            { $match: { director: director._id } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'media',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rate: { $avg: '$reviews.rating' }
                }
            },
            { $sort: { release_date: -1 } },
            { $limit: 12 },
            {
                $project: {
                    title: 1,
                    thumbnail: 1,
                    views: 1,
                    duration: 1,
                    rate: 1
                }
            }
        ]);

        const series = await Series.aggregate([
            { $match: { director: director._id } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'media',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    rate: { $avg: '$reviews.rating' }
                }
            },
            {
                $lookup: {
                    from: 'seasons',
                    localField: '_id',
                    foreignField: 'series',
                    as: 'seasons'
                }
            },
            {
                $addFields: {
                    totalEpisodes: { $sum: { $map: { input: '$seasons', as: 'season', in: { $size: '$$season.episodes' } } } }
                }
            },
            { $sort: { release_date: -1 } },
            { $limit: 12 },
            {
                $project: {
                    title: 1,
                    thumbnail: 1,
                    views: 1,
                    totalEpisodes: 1,
                    rate: 1,
                }
            }
        ]);

        res.status(200).json({
            status: 200,
            message: "fetch data successfully",
            director,
            movies,
            series
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
};

exports.createDirector = [upload, createDirectorValidation, async (req, res) => {
    try {
        const newDirector = await Director.create(req.body);
        res.status(201).json({
            status: 201,
            message: "Director created successfully",
            director: newDirector
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
}];

exports.updateDirector = [upload, editDirectorValidation, async (req, res) => {
    const directorId = req.params.id;

    try {
        const director = await Director.findById(directorId);
        if (!director) return res.status(404).json({ status: 404, message: "Director not found" });

        if (req.body.profile && director.profile) {
            fs.unlinkSync(path.join(__dirname, '../public/director/', director.profile));
        }

        const updatedDirector = await Director.findByIdAndUpdate(directorId, req.body, {
            new: true,
        });

        res.status(200).json({ status: 200, message: "Director updated", director: updatedDirector });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}];

exports.deleteDirector = async (req, res) => {
    try {
        const director = await Director.findByIdAndDelete(req.params.id);
        if (!director) {
            return res.status(404).json({ status: 404, message: "Actor not found" })
        }
        res.status(200).json({
            status: 204,
            message: "Director deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
};