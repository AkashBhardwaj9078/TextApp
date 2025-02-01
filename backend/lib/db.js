
import mongoose, { connect } from 'mongoose'

export const connectDB= async()=>{
  
    await  
    mongoose.connect(process.env.DB_CONNECT).then(()=>{
        console.log("connected to DB");
        
      }).catch((err)=>{
        console.error(err);
      })
}