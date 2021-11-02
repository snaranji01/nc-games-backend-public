exports.handle404Error = (req,res,next) => {
    res.status(404).send({msg: '404 Error: Route not found'})
}