const User = require('../models/User')
const crypto = require('crypto');

const controller = {}

controller.new = async (req, res) => {
    let user = req.body;
    user.password = encryptPassword(user.password);

    // verifing email
    try{
        const validEmail = await User.find({email: {$regex: user.email, $options: 'i'}});
        if(validEmail.length > 0){
            res.status(400).send("E-mail already registered")
            return;
        }
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }

    try{
        await User.create(user)
        res.status(201).send('');
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.list = async (req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

controller.getById = async (req, res) => {
    try {
        const id = req.params.id
        const obj = await User.findById(id)
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
        let user = req.body

        const id = user._id
        const obj = await User.findByIdAndUpdate(id, user)
        
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
        const obj = await User.findByIdAndDelete(id)
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

controller.login = async (req, res) => {
    let user = req.body;
    user.password = encryptPassword(user.password);

    try{
        const result = await User.find({email: {$regex: user.email, $options: 'i'}});
        if(result.length > 0){
            let resultUser = result[0]
            if(resultUser.password == user.password){
                res.status(200).send(resultUser._id);
            }
            else{
                res.status(400).send("Incorrect e-mail or password")
            }
    
        }else{
            res.status(404).send("E-mail not found");
        }

    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}

function encryptPassword(password){
    const algorithm = "aes-192-cbc";
    const key = crypto.scryptSync(password, 'salt', 24);

    const cipher = crypto.createCipher(algorithm, key);
    password = cipher.update(password, 'utf8', 'hex');
    password += cipher.final("hex");
    return password;
}

module.exports = controller 