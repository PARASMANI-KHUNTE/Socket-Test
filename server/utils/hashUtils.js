const argon = require('argon2')

const hassPassword = async (password) =>{
    try {
       const hassedPassword =  await argon.hash(password)
       return hassedPassword; 
    } catch (error) {
        return `Error - ${error}`
    }
}

const VerifyPassword = async (hassPassword , password) =>{
    try {
        const isMatch = await argon.verify(hassPassword , password)
        return isMatch;
    } catch (error) {
        return `Error - ${error}`
    }
}


module.exports = {hassPassword,VerifyPassword}