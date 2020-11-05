const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')



router.post('/signup', (req, res)=> {
    const {name, email, password} = req.body
    if(!email || !name || !password){
        return res.status(422).json({erro: 'Please add all the required fields'})
    }
    
    User.findOne({email: email})
            .then((savedUser) => {
                if(savedUser){

                    return res.status(422).json({erro: 'User already exists !! '})
                }

                bcrypt.hash(password, 12)
                        .then( hashedPass => {
                            const user =new User({
                                name: name,
                                email: email,
                                password: hashedPass
                            })
                            user.save().then((user) => {
                                res.json({message: "Saved User successfully"})
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        });
                

            }).catch((err) => {
                console.log(err)
            })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(422).json({error : 'Provide email and password'})
    }

    User.findOne({email})
            .then(savedUser => {
                if(!savedUser){
                    return res.status(422).json({error: 'Invalid email or password'})
                }
                bcrypt.compare(password, savedUser.password)
                        .then((doMatch) => {
                            if(doMatch){
                                const token = jwt.sign({_id : savedUser._id}, JWT_SECRET)
                                res.json({token})
                            }else{
                                return res.status(422).json({erros : 'Invalid email or password'})
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
            })
})



module.exports = router