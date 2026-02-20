"use client"


import Navbar from "@/components/Navbar";
import SubscriptionForm from "@/components/SubscriptionForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";




export default function AddSubscriptionPage(){
     const router=useRouter()

     const handleSubmit=async(data)=>
    {
       try{

       let token=localStorage.getItem("token")

       //if no token ,fetch
       if(!token){
            toast.error("You are not logged in!")
            router.push("/login")
            return
       }
    

        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`,{
           method:"POST",
           headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
           },
            body:JSON.stringify(data)
        })
            console.log("Response status:", res.status);

        if(!res.ok){
            const err=await res.json();
            throw new Error(err.error || "Failed to add subscription")
        }
        toast.success("Subscription added successfully ✅")
         router.push("/dashboard")
       }
        catch(err){
          console.log(err);
          toast.error("Error in adding subscription ❌")
        }
      
    }


    return(
         <div className="min-h-screen ">
            <Navbar/>
             <div className="max-w-3xl mx-auto mt-8 ">
                <SubscriptionForm onSubmit={handleSubmit}/>
             </div>
         </div>




    )
}