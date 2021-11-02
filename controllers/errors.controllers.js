exports.handle404Error = (req,res,next) => {
    res.status(404).send({msg: '404 Error: Route not found'})
    next(err)
}

exports.handleCustomErrors = (err,req,res,next) => {
    if(err.status === 404 && err.route === '/api/review/:review_id') {
        res.status(404).send({msg: err.msg})
    }
    next(err);
}

exports.handlePSQLErrors = (err,req,res,next) => {
    console.log(`error code: ${err.code}`)
    if(err.code === "22P02") {
        const errResponse = {
            msg: "400 Error: Bad Request - has caused a SQL Error",
            err
        };
        res.status(400).send(errResponse)
        next(errResponse)

    }
    next(err);
}

exports.handle500ServerError = (err,req,res,next) => {
    console.log(err);
    res.status(500).send({msg: `500 Server Error`, err});
}