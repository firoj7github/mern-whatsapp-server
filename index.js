import  express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import bodyParser from 'body-parser';
import ConnectDatabase from './database/db.js';
import user from './modal/user.js';
import conversation from './modal/conversation.js';
import message from './modal/message.js';




dotenv.config();
ConnectDatabase();
const app = express();


app.use(cors());

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;




app.listen(PORT, ()=>{
    console.log(`Sever is running on port ${PORT}`);
})


// Add User Database

app.post("/add",async(req,res)=>{
    try {
        let exist = await user.findOne({ sub: req.body.sub });

        if(exist) {
            res.status(200).json('user already exists');
            return;
        }

        const newUser = new user(req.body);
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    } 
})

app.post("/conversation/add", async(req,res)=>{
    

    try {

        let senderId = req.body.senderId;
    let receiverId = req.body.receiverId;

    const exist = await conversation.findOne({ members: { $all: [receiverId, senderId]  }})
    
    if(exist) {
        res.status(200).json('conversation already exists');
        return;
    }
    const newConversation = new conversation({
        members: [senderId, receiverId]
    });


    const savedConversation = await newConversation.save();
        response.status(200).json(savedConversation);
    } catch (error) {
        response.status(500).json(error);
    }
})

app.post("/conversation/get", async(req,res)=>{
    try {
        
        let senderId = req.body.senderId;
        let receiverId = req.body.receiverId;
        
        const Conversation = await conversation.findOne({ members: { $all: [ senderId, receiverId] }});
        res.status(200).json(Conversation);
    } catch (error) {
        res.status(500).json(error);
    }
})
app.post("/message/add", async(req,res)=>{
    const newMessage = new message(req.body);
    try {
        await newMessage.save();
        await conversation.findByIdAndUpdate(req.body.conversationId, { message: req.body.text });
        res.status(200).json("Message has been sent successfully");
    } catch (error) {
        res.status(500).json(error);
    }
})

// User get

app.get("/users", async (req,res)=>{
   try{
        const users= await user.find({});
        return res.status(200).json(users);
   }catch(err){
         return res.status(500).json(err.message);
   }
})

app.get("/message/get/:id", async(req,res)=>{
    try {
        const messages = await message.find({ conversationId: req.params.id });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
})


app.get('/', (req,res)=>{
    res.send('Whatsapp server');
})