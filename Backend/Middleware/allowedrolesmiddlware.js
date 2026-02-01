export const allowedroles=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).send({message:"No permission to access this resource"})
        }
        next();
    }
}