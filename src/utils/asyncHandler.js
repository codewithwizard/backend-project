const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.reslove(requestHandler(req,res,next)).
        catch((err) => next(err))
    }
}

export { asyncHandler }




// this is a "wrapper-function" which we are gonna use often 
// this function can be write in both ways using 1) try & catch and 2) promise





// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     }
//     catch (error) {
//             res.status(error.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }