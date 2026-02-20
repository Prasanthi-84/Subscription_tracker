"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"



export default function SignupPage(){

    const router=useRouter()
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
    })
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("")
        setSuccess("")
        setLoading(true)
    
   try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`, { 
     method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    })

    // try parse JSON, but fallback to text
    let data;
    try { data = await res.json(); } catch (err) { data = { message: await res.text() }; }
  

     if(res.ok){
        setSuccess("Signup successfull! Redirecting to login...")
          setTimeout(() => router.push("/login"), 2000);
     }
     else{
         setError(data.message || "Signup failed. Try again.");
     }

   }
   catch(err){
    setError("Something went wrong. Please try again.")
   }
   finally{
    setLoading(false)
   }
   
}
return(
    <div className="min-h-screen flex  items-center justify-center  bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Create Account
            </h1>
 
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Name</label>
                <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                 />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Email</label>
                 <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                 />
               </div>
               
                <div>
                   <label className="block mb-2 font-medium text-gray-700">Password</label>
                   <input
                     type="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

               {error && <p className="text-red-500 text-sm">{error}</p>}
               {success && <p className="text-green-600 text-sm">{success}</p>}

                   <button
                      type="submit"
                      disabled={loading}
                     className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
               {loading ? "Creating Account..." : "Sign Up"}
               </button>
            </form>

            <p className="text-center text-sm mt-4 text-gray-600">
            
                  Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        </div>
    </div>
)
}