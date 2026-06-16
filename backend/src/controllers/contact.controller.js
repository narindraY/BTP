const nodemailer = require("nodemailer");


exports.sendContact = async (req,res)=>{

  const { nom, email, message } = req.body;


  if(!nom || !email || !message){
    return res.status(400).json({
      message:"Tous les champs sont obligatoires"
    });
  }

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
  try {

    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
      }
    });


    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      replyTo: email,

      subject:`Nouveau message de ${nom}`,

      html:`
        <h3>Nouveau contact</h3>

        <p><b>Nom :</b> ${nom}</p>

        <p><b>Email :</b> ${email}</p>

        <p><b>Message :</b></p>

        <p>${message}</p>
      `
    });


    res.json({
      success:true,
      message:"Message envoyé"
    });


  }catch(err){

    console.log(err);

    res.status(500).json({
      message:"Erreur envoi email"
    });

  }

}