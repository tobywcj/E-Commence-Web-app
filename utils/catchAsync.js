// handle generic mongoose errors or any funcs that return promises then catch and pass them to next to the error handler
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
