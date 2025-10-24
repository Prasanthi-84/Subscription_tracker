

import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'
import dayjs from 'dayjs'


//create user subscription
export const createSubscription=async(req,res,next)=>{
    // console.log('request body:',req.body)
    // console.log('req.user:', req.user);
    try{

         const subscription=await Subscription.create({
            ...req.body,
            user:req.user._id,

         })


       const {workflowRunId}=await workflowClient.trigger({
        url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body:{
            subscriptionId:subscription._id,
        },
        headers:{
            'content-type':'application/json',
        },
        retries:0,
      })

         res.status(201).json({success:true,data:subscription,workflowRunId})
    }

    catch(error){
        next(error)
    }
    
}

//get all subscriptions
export const getAllSubscriptions=async(req,res,next)=>{
    try{
     
         const subscriptions=await Subscription.find().populate('user','name email')
         res.status(200).json({success:true,data:subscriptions})
    }
    catch(error){
        next(error)
    }
}

//get subscription by id
export const getSubscriptionsById=async(req,res,next)=>{
      try{
          const subscription=await Subscription.findById(req.params.id).populate('user','name email')

          if(!subscription){
              const error = new Error('Subscription not found');
              error.statusCode = 404;
              throw error;
          }
       }
      catch(error){
        next(error)
      }
}

//update subscription
export const updateSubscription=async(req,res,next)=>{
    try{
  
         const {updates}={...req.body}
         const updatedSubscription=await Subscription.findByIdAndUpdate(req.params.id,updates,{new:true})

         if(!updatedSubscription){
                  const error = new Error('Subscription not found');
                   error.statusCode = 404;
                  throw error;
            }
         
          res.status(200).json({ success: true, data: updatedSubscription });
         
        }
    catch(error){
        next(error)
    }
}

//deleteSubscription
export const deleteSubscription=async(req,res,next)=>{
    try{
     
        const deletedSubscription=await Subscription.findByIdAndDelete(req.params.id)

        if(!deletedSubscription){
            const error = new Error('Subscription not found');
             error.statusCode = 404;
             throw error;
        }
          res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
         
    }
    catch(error){
        next(error)
    }
}

//get user subcriptions
export const getUserSubscriptions=async(req,res,next)=>{
     
    try{
     
        //check if usr is same as one in token
      if(req.user.id !== req.params.id){
           const error=new Error('You are not the owner of this account');
           error.status=401;
           throw error;
      }
      const subscriptions=await Subscription.find({user:req.params.id})
      
      res.status(201).json({success:true,data:subscriptions})

    }
    catch(error){
        next(error)
    }
}

//cancel subscriptions
export const cancelSubscription=async(req,res,next)=>{
    try{
 
        const subscription=await Subscription.findById(req.params.id)

        if(!subscription){
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        //allow owner to cancel
        if(subscription.user.toString()!==req.user._id.toString()){
            const error = new Error("You are not allowed to cancel this subscription");
            error.statusCode = 401;
            throw error;
        }

        subscription.status='canceled'
        subscription.canceledAt=new Date()


        await subscription.save();
   
        res.status(200).json({
             success: true,
             message: "Subscription canceled successfully",
             data: {
               ...subscription.toObject(), // convert mongoose doc to plain JS
               _id: subscription._id       // ensure _id is included
  }
         });      
    }
    catch(error){
        next(error)
    }
}

//upcoming subscription
export const upcomingRenewals=async(req,res,next)=>{
    try{
  
         const today=dayjs()
         const nextWeek=today.add(7,'day')

         const upcomingSubscriptions=await Subscription.find({
            //$gte → greater than or equal to today
            // $lte → less than or equal to 7 days from today
            renewalDate: { $gte:today.toDate(),$lte:nextWeek.toDate()},
            status:'active'
         })

         res.status(200).json({ success: true, data: upcomingSubscriptions }); 
    }
    catch(error){
        next(error)
    }
}