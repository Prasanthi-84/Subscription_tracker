import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Subscription name is required'],
        trim:true,
        minLength:2,
        maxLength:100
    },
    price:{
        type:Number,
        required:[true,'Subscriptin price is required'],
        min:[0,'Price must be greater than 0'],
        
    },
    currency:{
        type:String,
        enum:['INR','USD'],
        default:'INR'
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        enum:['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required:true
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active'
    },
    //startDate must be less or equal to current date
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator:(value)=>value <= new Date(),
            message:'Start date must be in the past'
        }
    },
    //Renewals always come after a valid subscription start
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                return value >this.startDate
            },
            message:'Renewal date must be after the start date'
        }
    },

     //connects subscription to user model
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    }
},{timestamps:true});

//auto calculate renewal date if missing
subscriptionSchema.pre('validate',function(next){
    if(!this.renewalDate){
        const renewalPeriods={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365

        };
        this.renewalDate=new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency])
    }
    
        //check if renewal date is already expired
        if(this.renewalDate < new Date()){
            this.status='expired'
        }
        next();

})

const Subscription=mongoose.model('Subscription',subscriptionSchema)

export default Subscription;

