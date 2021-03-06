exports.handle404Error = (req, res, next) => {
    res.status(404).send({ msg: '404 Error: Route not found' })
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: err.msg })
    }
    else if (err.status === 400) {
        res.status(400).send({ msg: err.msg })
    } else {
        next(err)
    }

}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        const errResponse = {
            msg: "400 Error: Bad Request - has caused a SQL Error",
            err
        };
        res.status(400).send(errResponse)

    } else {
        next(err)
    }

}

exports.handle500ServerError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: `500 Server Error`, err });
}