export const allowedroles=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user || !allowedroles.include(req.user.usertype)){
            return res.status(403).send({message:"No permission to access this resource"})
        }
        next();
    }
}