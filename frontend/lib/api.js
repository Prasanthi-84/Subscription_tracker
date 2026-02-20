import axios from 'axios'

export const api=axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1",
    withCredentials:true,//cookies or tokens

})
