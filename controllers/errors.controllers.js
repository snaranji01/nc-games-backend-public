exports.handle404Error = (req,res,next) => {
    res.status(404).send({msg: '404 Error: Route not found'})
}

exports.handleCustomErrors = (err,req,res,next) => {
    if(err.status === 404 && err.route === '/api/review/:review_id') {
        res.status(404).send({msg: err.msg})
    }
    next(err)
}

exports.handle500ServerError = (err,req,res,next) => {
    console.log(err);
    res.status(500).send({msg: `500 Server Error`, err});
}