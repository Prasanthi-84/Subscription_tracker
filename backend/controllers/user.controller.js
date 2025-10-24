import User from "../models/user.model.js";

//to get all users
export const getUsers=async (req,res,next)=>{
    try{
        const users=await User.find();

        res.status(200).json({success:true,data:users})
    }
    catch(error){
       next(error);
    }

}

//get a single user
export const getUser=async (req,res,next)=>{
    try{ //select all fields expect pswd
       const user=await User.findById(req.params.id).select('-password');

       if(!user){
        const error=new Error('User not found')
        error.statusCode=404;
        throw error;
       }
       res.status(200).json({success:true,data:user})
    }
    catch(error){
        next(error)
    }
}


//create a user
export const createUser=async(req,res,next)=>{
    try{
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
     
         // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

         // Return user info without password
        const userToReturn = { ...newUser.toObject(), password: undefined };

        res.status(201).json({ success: true, data: userToReturn });
    }
    catch(error){
        next(error)
    }
}

//update user
export const updateUser=async(req,res,next)=>{
    try{
      
        const updates={...req.body}

        //updates passowrd
        if(updates.password){
            updates.password=await bcrypt.hash(updates.password,10)
        }
        
        //updates document
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {new:true}
        ).select('-password');

       //user with id not exists
        if(!updatedUser){
            const error=new Error("User not found")
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({success:true,data:updatedUser})
    }
    catch(error){
        next(error)
    }
}


//delete a user
export const deleteUser=async(req,res,next)=>{
    try{
       const deletedUser=await User.findByIdAndDelete(req.params.id)

       //user doesnot exists
       if(!deletedUser){
          const error = new Error("User not found");
          error.statusCode = 404;
          throw error;
       }
       res.status(200).json({success:true,message:"User deleted successfully"})
    }
    catch(error){
        next(error)
    }
}