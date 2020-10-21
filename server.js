import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from './mongoData'
const app=express();
const port =process.env.PORT|| 8001;
app.use(express.json());
app.use(cors());
const mongoUrl='mongodb://discordDb:G87cFf85rYayDchn@cluster0-shard-00-00.pfiwy.mongodb.net:27017,cluster0-shard-00-01.pfiwy.mongodb.net:27017,cluster0-shard-00-02.pfiwy.mongodb.net:27017/discordDb?ssl=true&replicaSet=atlas-r8wl9i-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoUrl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('data base connected!!')
})
.catch((e)=>{
    console.log(e);
})
app.get('/',(req,res)=>res.status(200).send('hello wolrd'));
app.post('/new/channel',(req,res)=>{
   const dbData=req.body;
   mongoData.create(dbData,(err,data)=>{
       if(err){
           res.status(500).send(err);
       }else{
           res.status(201).send(data);
       }
   })
});
app.get('/get/channelList',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            let channels=[];
            data.map((channeldata)=>{
                const channelInfo={
                    id:channeldata._id,
                    name:channeldata.channelName
                }
                channels.push(channelInfo);
            })
            res.status(200).send(channels);
        }
    })
});

app.post('/new/message',(req,res)=>{
    const newMessage=req.body
    mongoData.update(
            {_id:req.query.id},
            {$push:{conversation:req.body}},
            (err,data)=>{
                if(err){
                    console.log('Error savong message...');
                    res.status(500).send(err);
                }else{
                    res.status(201).send(data);
                }
            }
    )
    
});
app.get('/get/data',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})
app.get('/get/coversation',(req,res)=>{
   const id=req.query.id;
   mongoData.find({_id:id},(err,data)=>{
    if(err){
        res.status(500).send(err);
    }else{
        res.status(200).send(data);
    }
   })
})
app.listen(port,()=>{
   console.log('Server running port 8001') 
})
