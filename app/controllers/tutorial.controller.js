const db = require('../models');
const Tutorial = db.tutorials;

//create and save a new tutorial
exports.create = (req, res) => {
    //validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty." });
        return;
    }

    //create a tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    //save tutorial in the db
    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

//retrieve all tutorials from the database
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Tutorial.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: 
                 err.message || "Some error occurred while retrieving tutorials."
            });
        });

};

//Find a single tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(400).send({ message: "Not found Tutorial with id " + id });
            else res.send(data);

            })
            .catch(err => {
                res
                .status(500)
                .send({ message: "Error retrieving Tutorial with id=" + id });
            });


};

//update tutorial with the id from request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!` 
            });
         }  else res.send({ message: "Tutorial was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating Tutorial with id=" + id 
        });
    });
    
};

//delete a tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            } else {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
        

};

//delete all tutorials from the db
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tutorials."
            })
        })

};

//find all published tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });

};
