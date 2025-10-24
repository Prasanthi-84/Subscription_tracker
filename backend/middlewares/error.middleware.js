//err,req,res,next=>error handlers in express

const errorMiddleware=(err,req,res,next)=>{
    try{

     let error={...err};

     error.message=err.message
     console.log(err)

     //moongode specific checks
     //convert moongose err to htttp err


     //cast error=>404
     //when a value cannot be cast to the expected type
     if(err.name === 'CastError'){
        const message='Resource not Found'
        error=new Error(message)
        error.statusCode=404
     }

      //duplicate err=>bad request
     if(err.code === 11000){
        const message='Duplicate field value inserted',
        error=new Error(message)
        error.statusCode=400
     }

     //validation err=>400
     if(err.name === 'validationError'){
        const message=Object.values(err.errors).map(val=>val.message)
        error=new Error(message.join(','))
        error.statusCode=400;
     }

        res.status(error.statusCode || 500)
        .json({success:false,error:error.message || 'Server Error'})


    }
    catch(error){
        next(error)
    }
}

export default errorMiddleware;