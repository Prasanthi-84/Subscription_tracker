import Link from "next/link";

export default function Home() {
  return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-10 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Welcome to SubDub
      </h1>
      <p className="text-gray-600 mb-8"> 
        Manage all your subscriptions in one place. Never miss a renewal again!
      </p>
       
       <div className="flex justify-center gap-4">
        <Link href='/login'>
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
              Login
          </button>
        </Link>
        <Link href="/signup">
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Sign Up
        </button>
        </Link> 
       </div>
    </div>
  
  {/* footer */}
  <footer className="mt-12 text-gray-600 text-sm">
      &copy; {new Date().getFullYear()} SubDub. All rights reserved.
  </footer>
   
  </div>  
  );
}
