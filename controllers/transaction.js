const Tran = require('../models/Transaction')

const controller = {}

controller.new = async (req, res) => {
    req.body.date = Date.now();

    if(req.body.type != "D" && req.body.type != "W"){
        res.status(400).send("Type not found")
        return;
    }

    if(Number(req.body.amount) <= 0 || Number(req.body.amount) > 999999999){
        res.status(400).send("Amount must be betweeen 0 and 999.999.999")
        return;
    }

    try{
        

        const idUser = req.body.user
        const obj = await Tran.find({user: idUser}).sort('-date');
        if (obj.length > 0) { 
            let lastTransaction = obj[0];
            if(req.body.type == "D")
                req.body.balanceAfterTransaction = Number(req.body.amount) + Number(lastTransaction.balanceAfterTransaction);
            else if(req.body.type == "W")
                req.body.balanceAfterTransaction = Number(lastTransaction.balanceAfterTransaction) - Number(req.body.amount);
        }
        else {
            if(req.body.type == "D")
                req.body.balanceAfterTransaction = req.body.amount;
            else if(req.body.type == "W"){
                res.status(400).send('Insuficient balance')
                return;
            }
        }

        if(req.body.balanceAfterTransaction < 0){
            res.status(400).send('Insuficient balance')
            return;
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
    
    try{
        await Tran.create(req.body)
        res.status(201).send('');
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.list = async (req, res) => {
    try{
        const trans = await Tran.find().populate('user').sort('-date')
        res.send(trans);
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.getById = async (req, res) => {
    try {
        const id = req.params.id
        const obj = await Tran.findById(id)
        if (obj) { 
            res.send(obj)
        }
        else {
            res.status(404).end()
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

controller.update = async (req, res) => {
    try{
        let tran = req.body

        const id = tran._id
        const obj = await Tran.findByIdAndUpdate(id, tran)
        
        if(obj){
            res.status(204).end()
        }
        else{
            res.status(404).end()
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.delete = async(req, res) =>{
    try{
        const id = req.body._id
        const obj = await Tran.findByIdAndDelete(id)
        if(obj){
            res.status(204).end()
        }
        else{
            res.status(404).end()
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.getBalance = async(req, res) => {
    try{
        const idUser = req.params.idUser
        const obj = await Tran.find({user: idUser}).sort('-date');
        if (obj.length > 0) { 
            let lastTransaction = obj[0];
            res.status(200).send(lastTransaction.balanceAfterTransaction.toString())
        }
        else {
            res.status(404).end()
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.getByUser = async(req, res) => {
    try{
        const idUser = req.params.idUser
        const result = await Tran.find({user: idUser}).sort('-date');
        res.send(result);
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = controller 