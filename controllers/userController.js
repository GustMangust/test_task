const uuid = require('uuid')
const path = require('path')
const {User, UserDetails} = require('../models/models')
const ServerError = require('../errors/ServerError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const PdfDocument = require('pdfkit')
const fs = require('fs')
const { serialize, deserialize } = require("v8")

const generateJwt = (id,email) =>{
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController{
    async getAll(req,res){
        const users = await User.findAll();
        res.json(users)
    }
    
    async getById(req,res, next){
        const {id} = req.params
        if(isNaN(id)){
            return next(ServerError.badRequest('Please enter correct Id'))
        }
        const user = await User.findOne({where:{id}})
        return res.json(user)
    }
    
    async update(req,res){
        try{
            const {id} = req.params
            
            const newUser = req.body

            if(isNaN(id)){
                return next(ServerError.badRequest('Please enter correct Id'))
            }

            const user = await User.update(newUser, {where:{id}})
            res.status(200).json()
        } catch(err){
            res.status(400).json()
        }
    }

    async delete(req,res){
        try{
            const {id} = req.params
            if(isNaN(id)){
                return next(ServerError.badRequest('Please enter correct Id'))
            }
            const user = await User.destroy({where: {id}})
            
            res.status(200).json()
        } catch(err){
            res.status(400).json()
        }
    }

    async register(req,res,next){
        const {email,password,firstName,lastName} = req.body
        
        const {image} = req.files

        if(!email || !password || !firstName || !lastName || !image){
            return next(ServerError.badRequest("Enter correct data"))
        }

        const candidate = await User.findOne({where:{email}})

        if(candidate){
            return next(ServerError.badRequest("User already exists"))
        }
    
        let fileName = uuid.v4() + ".jpg"

        image.mv(path.resolve(__dirname,'..','static', fileName))      

        const hashPassword = await bcrypt.hash(password, 5)

        const user = await User.create({email, firstName,lastName, image: fileName})
        
        const userDetails = await UserDetails.create({password: hashPassword, userId: user.id})

        const token = generateJwt(user.id, email)

        return res.json({token})
    }

    async authorize(req,res,next){
        const token = generateJwt(req.user.id, req.user.email)

        return res.json({token})
    }

    async login(req,res,next){
        const {email,password} = req.body

        const user = await User.findOne(
            {
                where: {email},
                include: [{model: UserDetails, as: 'userDetails'}]
            }
        )
         
        if(!user){
            return next(ServerError.badRequest("User doesn't exists"))
        }

        const comparePassword = bcrypt.compareSync(password, user.userDetails.password)
        
        if(!comparePassword){
            return next(ServerError.badRequest("Incorrect password"))
        }

        const token = generateJwt(user.id, email)

        return res.json({token})
    }

    async generatePdf(req,res){
        try{
            
            const {email} = req.body

            const user = await User.findOne({where:{email}})

            const doc = new PdfDocument()
            
            let fileName = uuid.v4() + ".pdf"

            const pdfPath = path.resolve(__dirname,'..','static', fileName)
            
            doc.pipe(fs.createWriteStream(pdfPath))
            
            doc.fontSize(27).text(`${user.firstName} ${user.lastName}`, 100, 100)

            const imagePath = path.resolve(__dirname,'..','static', user.image)
            
            doc.image(imagePath, {
                fit: [300, 300], 
                align: 'center',
                valign: 'center'
            });

            await User.update({pdf: Buffer.from(fileName)}, {where:{id:user.id}})
            
            doc.end()

            res.json(true)
        } catch(err){
            console.log(err)
            return res.json(false)
        }
    }
}

module.exports = new UserController()