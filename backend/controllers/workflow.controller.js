

import dayjs from 'dayjs';
//allows commonjs in ES module
import {createRequire} from 'module'
const require=createRequire(import.meta.url)
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';
//serverless library for corn jobs etc..
const {serve} =require('@upstash/workflow/express')


const REMINDERS=[7,5,2,1]

//main workflow endpoint
//sendReminders=>serverless fn & used to send sendreminders to subscription
export const sendReminders=serve(async(context)=>{

    const {subscriptionId}=context.requestPayload;//data from workflow

    //calls another fn to fetch sunscription details from db
    const subscription=await fetchSubscription(context,subscriptionId)

    //check for active /exists subscription
    if(!subscription || subscription.status !== 'active') return;

   //need for comparing dates /reminder schedules 
     const renewalDate=dayjs(subscription.renewalDate);

     if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date has passed for subscription ${subscriptionId}.Stopping workflow.`)
        return;
     }


     //calculates the exact date to send this reminder.
     for(const daysBefore of REMINDERS){
        const reminderDate=renewalDate.subtract(daysBefore,'day')
     

     //checks for future remider
     //if yes=>pause reminder until that day
     if(renewalDate.isAfter(dayjs())){
        await sleepUntilReminder(context,`Reminder ${daysBefore} days before`,reminderDate)
     }

     //if today send email
     if(dayjs().isSame(reminderDate,'day')){
        await triggerReminder(context,`${daysBefore} days before reminder`,subscription)
     }
    }
    
})



//fetch sub from db
//fetches sub by id and populates user info
const fetchSubscription=async(context,subscriptionId)=>{
    return await context.run('get subscription',async()=>{
        return  Subscription.findById(subscriptionId).populate('user','name email')
    })
}


//sleep workflow upto specific date
const sleepUntilReminder=async(context,label,date)=>{
    console.log(`Sleeping until ${label} reminder at ${date}`)
    await context.sleepUntil(label,date.toDate())
}


//reminder
const triggerReminder=async(context,label,subscription)=>{
    return await context.run(label,async()=>{
        console.log(`Triggering ${label} reminder`)

        // //send email
        await sendReminderEmail({
            to:subscription.user.email,
            type:label,
            subscription
        })
    })
}