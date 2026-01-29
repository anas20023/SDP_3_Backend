import e from "express";
import * as subscriptionService from "../services/subscription.service.js";
export const createSubscription=async(req,res)=>{
    const data= req.body
    if(req.user.role!=="admin" || req.user.role!=="mod"){
       return res.status(401).json({
            message:"You are not authorized for this Operation"
        })
    }
    try {
        const umm= await  subscriptionService.createSubscription(data)
       return res.status(201).json(umm)
    } catch (e) {
       return res.status(400).json({
            message:e.message
        })
    }
}