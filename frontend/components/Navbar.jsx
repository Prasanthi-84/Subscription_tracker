"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { useState } from "react";
import { toast } from "sonner";




export default function Navbar(){
      const router=useRouter();
     // const [showForm,setShowForm]=useState(false)

      const handleLogout=()=>{
       toast.message("Logged out Successfully!")
        router.push("/login")
      }






    return(
     <nav className="flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
        <h1 className="text-xl font-semibold tracking-wide">
            Subscription Manager
        </h1>
        <div className="flex gap-4 ">
            <Button 
            variant="secondary"
            className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition "
                   onClick={()=>router.push("/dashboard/add-subscription")}>
                     Add Subscription
                   </Button>
        
        <Button className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition "
         onClick={handleLogout}>Logout</Button>
        </div>
     </nav>

    )
}