const apiDescription = require('./api-endpoints-description.json');

exports.getApiDescription = (req,res,next) => {
    res.status(200).send({apiDescription})
}