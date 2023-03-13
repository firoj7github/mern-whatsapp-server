import mongoose from 'mongoose';


const ConnectDatabase=async()=>{
       try{
        mongoose.set('strictQuery', false);
         const connection = await mongoose.connect(process.env.MONGO_URL,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            
         });
         console.log('Mongo Connected');

       }
       catch(err){
        console.log(`Error: ${err.message}`);
        process.exit(1)
       }
}

export default ConnectDatabase;
