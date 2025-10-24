import aj from '../config/arcjet.js'
import { NODE_ENV } from '../config/env.js'



const arcjetMiddleware=async(req,res,next)=>{
    try{

        if(NODE_ENV === 'development')return next();

        //inspects the incoming req [bot,rate limits etc]
        const decision=await aj.protect(req,{requested:1})

        if(decision.isDenied()){
            //single user sending too many req->rate limiting
            //429->too many req
            if(decision.reason.isRateLimit())
                return res.status(429).json({error:'Rate limit exceeded'})

             //req comes from fake user
             //403->forbidden
            if(decision.reason.isBot())
                return res.status(403).json({error:'Bot detected'})

             return res.status(403).json({error:'Access denied'})
        }
        next();
    }
    catch(error){ 
        console.log(`Arcjet Middleware Error: ${error}`)
    }
   
}
export default arcjetMiddleware;