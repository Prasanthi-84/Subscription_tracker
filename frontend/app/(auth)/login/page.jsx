"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"


export default function SignInPage(){
     const router=useRouter()
     const [email,setEmail]=useState("")
     const [password,setPassword]=useState("")
     const [error,setError]=useState("")

     console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

     const handleLogin=async(e)=>{
            e.preventDefault();

            try{
               console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
               console.log('Login data:', {email, password: '***'});
               
               const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,{
                
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                
                body:JSON.stringify({email,password})
               })
               
               console.log('Response status:', res.status);
               
               // Parse response
               let data;
               const contentType = res.headers.get('content-type');
               if (contentType && contentType.includes('application/json')) {
                 data = await res.json();
               } else {
                 const text = await res.text();
                 data = { message: text };
               }
               
               console.log("Login response:", data);


               if(!res.ok){
                setError(data.message || "Login failed");
               }
               else{
                const token=data?.data?.token
                if(token){
                    localStorage.setItem("token",token)
                    console.log("Token saved:",localStorage.getItem("token"));
                    router.push('/dashboard')
                }
                else {
                      console.error("No token found in response:", data)
                      setError("Login successful, but token missing. Check backend response.")
                     }
               }
            }
            catch(err){
                console.error("Login error:", err)
                setError(`Something went wrong: ${err.message}`)
            }
     }
 

return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                  Login
            </h1>
            
             {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                 />
                <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required 
                />
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                Login
                </button>
            </form>
            <p className="text-gray-500 text-sm text-center mt-4">
             Don't have an account?{" "}
             <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
            </p>
        </div>
    </div>

)

}


