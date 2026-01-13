import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect:"postgres"

})
const connection = ()=>{
    try{
        sequelize.authenticate()
        console.log("database connected succesfully")
        sequelize.sync({alter:true})
    }
    catch(e){
        console.log(e.message)
        console.log("db connection failed")
    }
}
export {sequelize,connection}