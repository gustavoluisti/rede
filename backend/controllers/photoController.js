const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");

//Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user;
    const user = await User.findById(reqUser._id);

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // If photo was created successfully, return data
    if (!newPhoto) {
        res.status(422).json({ errors: ["Houve um problema, por favor tente novamente mais tarde."] });
        return;
    }

    res.status(201).json(newPhoto);
};

// Remove a photo from DB 
const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const reqUser = req.user;

        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        // Check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada"] });
            return;
        }

        // check if photo belongs to user
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] });
            return;
        }

        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso." });
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;

    }
}

// Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec();

    return res.status(200).json(photos);
}

// Get user photos
const getUserPhotos = async (req, res) => {
    const { id } = req.params;

    const photos = await Photo.find({ userId: id })
        .sort([["createdAt", -1]])
        .exec();

    res.status(200).json(photos);
};

// Get photo by id
const getPhotoById = async (req, res) => {
    try {
        const { id } = req.params;

        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        //Check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada"] });
            return;
        }

        res.status(200).json(photo)

    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }
};

// Update a photo
const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] });
        return;
    }

    if (title) {
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso" });

}


// Like functionality
const likePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }

    // Check if user already liked the photo
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ["Você já curtiu esta foto."] });
        return;
    }

    // Put user id in array of likes
    photo.likes.push(reqUser._id);

    await photo.save();

    res
        .status(200)
        .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida!" });
};

// Comment functionality
const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    // Check id photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }

    // Put comment in the array comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    }

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({ comment: userComment, message: "O comentário foi adicionado com sucesso!" });
}

// Seach photos by title
const seachPhotos = async (req, res) => {
    try {

        const { q } = req.query;

        const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

        res.status(200).json(photos);

    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    seachPhotos
}
