import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js'
import { createSubscription,getUserSubscriptions,getAllSubscriptions, getSubscriptionsById, updateSubscription, deleteSubscription, cancelSubscription, upcomingRenewals } from "../controllers/subscription.controller.js";

const subscriptionRouter=Router();

subscriptionRouter.get('/',getAllSubscriptions)

subscriptionRouter.get('/:id',getSubscriptionsById)

subscriptionRouter.post('/',authorize,createSubscription)

subscriptionRouter.put('/:id',updateSubscription)

subscriptionRouter.delete('/:id',deleteSubscription)

subscriptionRouter.get('/user/:id',authorize,getUserSubscriptions)

subscriptionRouter.put('/:id/cancel',cancelSubscription)

subscriptionRouter.get('/upcoming-renewals',upcomingRenewals)
export default subscriptionRouter