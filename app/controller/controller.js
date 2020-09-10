const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const base64 = require('base-64');
const utf8 = require('utf8');
const { totp } = require('otplib');
var model = require('../../models');
const { Op } = require("sequelize");
var myTotp="";
var email = "",
companyname ="", domainname ="" , location="", empcount ="",
firstname="", lastname="", password="",
username="", loginpassword="",
categoryId, userId, user_layout, email_layout,
categoryResponse="", announceResponse, eventResponse, reminderResponse;
let passwordValid;
login={

}


exports.register = function (req, res) {
    email = req.body.mail;
    const sharedSecret = email + "APICHALLENGE";
    totp.options = { digits: 6, algorithm: "sha512" }
    myTotp = totp.generate(sharedSecret);
    const isValid = totp.check(myTotp, sharedSecret);
    
    const authStringUTF = email + ":" + myTotp;
    const bytes = utf8.encode(authStringUTF);
    const encoded = base64.encode(bytes);
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kirtthiga.manoharan@codingmart.com",
            pass: "codmart123"
        }
    });
    let info = transporter.sendMail({
        from: "kirtthiga.manoharan@codingmart.com",
        to: email,
        subject: "Otp verification",
        html: `<p>Your otp is: ${myTotp}</p>`
    });
};

exports.code = function (req, resp) {
    var code = req.body.code;
    if(code == myTotp){
        resp.json({ "otp":true })
    }
    else{
        resp.json({ "otp":false })
    }
    
};
exports.setup = function (req,res) {
    companyname = req.body.companyname;
    location = req.body.location;
    empcount = req.body.empcount;
    domainname = req.body.domainname;
}
exports.password = function (req,response) {
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    password = req.body.password;

    var passwordValidation = password;
    var passwordValidator = require('password-validator');
    var schema = new passwordValidator();
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits();
    var passCheck = schema.validate(passwordValidation);
    if (passCheck) {
        passwordValid = "Perfect"
    }
    else {
        passwordValid = "Not Perfect"
    }
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (!err) {
            model.users.create({ 
                email: email,
                fname: firstname,
                lname: lastname,
                password: hash,
                company_name: companyname,
                location: location,
                emp_count: empcount,
                domain_name: domainname,
                otp:myTotp,
                category_id:0
            }).then((res) => {
                response.json({ "passValid" : passwordValid })
            })
        }
    })
}
exports.login = async function (req,resp) {
    var userlogin = req.body;
    username = req.body.username;
    loginpassword = req.body.password;
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
        var passHash = '';
        await model.users.findAll({
            attributes: ['password'],
            where: {
                email: username
            }
        }).then(res => {
            passHash = res[0].dataValues.password;
            bcrypt.compare(req.body.password, passHash, function (err, res) {
                if (res) {
                    login["user"] = userlogin;
                    var token = jwt.sign(req.body.username, 'user');
                    resp.json({ "s": "valid", "token": token, "mail": req.body.username });

                } else {
                    resp.json({ "s": "notvalid" });
                }
            })
        })
    })
}
exports.category = function(req,resp) {
    var user = req.body.userMail;
    var subject = req.body.subject;
    var category = req.body.category;

    var expiry = req.body.expiry;
    var eventdate = req.body.eventdate;
    var eventtime = req.body.eventtime;
    var location = req.body.location;

    var description = req.body.description;
    var notify = req.body.notify;
    model.category.findAll({
        attributes: ['category_id'],
            where: {
                name: category
            }
    }).then((res) =>{
        categoryId = res[0].dataValues.category_id;
    }) 
        model.users.update({
            category_id:categoryId},
            {where:{
                email :user
            }}
        )
        model.users.findAll({
            attributes: ['id'],
            where: {
                email: user
            }
        }).then((res)=>{
            userId = res[0].dataValues.id; 
            if(categoryId == 1){
                model.announcement.create({
                    user_id : userId,
                    subject : subject,
                    description : description,
                    notify_to: notify
                }).then((res)=>{
                    categoryResponse = res.dataValues.body;
                })
            }
            if(categoryId == 2){
                model.event.create({
                    user_id : userId,
                    subject : subject,
                    date: eventdate,
                    time: eventtime,
                    location:location,
                    description : description,
                    notify_to: notify
                }).then((res)=>{
                    categoryResponse = res.dataValues.body;
                    })
            }
            if(categoryId == 3){
                model.reminder.create({
                    user_id : userId,
                    expires_on:expiry,
                    subject : subject,
                    description : description,
                    notify_to: notify
                }).then((res)=>{
                    categoryResponse = res.dataValues.body;
                })
            }
        }).then((res) => {
            resp.send({ 'category': categoryResponse })
        })
}
exports.layout = async function(req,response) {
    model.users.findAll({
        attributes:['id'],
        where:{
            email : req.body.mail
        }
    }).then((res)=>{
        user_layout = res[0].dataValues.id;  
        
    model.users.findAll({
        attributes:['email'],
        where:{
            id:user_layout
        }
    }).then((res)=>{
        email_layout = res[0].dataValues.email
    })
    
    model.announcement.findAll({
        attributes:['subject','description','notify_to','createdAt'],
        where:{
            user_id : user_layout
        }
    })
    .then((res)=>{
        announceResponse = res.map(announce => ({ "announcement": announce.dataValues }));
    })
    model.event.findAll({
        attributes:['subject','date','time','location','description','notify_to','createdAt'],
        where:{
            user_id : user_layout
        }
    }).then((res)=>{
        eventResponse = res.map(event => ({ "event": event.dataValues }));
    })
    model.reminder.findAll({
        attributes:['subject','expires_on','description','notify_to','createdAt'],
        where:{
            user_id : user_layout
        }
    }).then((res)=>{
        reminderResponse = res.map(remind => ({ "reminder": remind.dataValues }));
    })


    }).then(async(res)=>{
        await response.json({ "announcement":announceResponse, "event":eventResponse,"reminder":reminderResponse, "user":email_layout })
    })
}