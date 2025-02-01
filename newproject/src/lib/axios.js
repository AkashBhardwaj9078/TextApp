import axios from 'axios'

export const axiosInstance=await axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true
})