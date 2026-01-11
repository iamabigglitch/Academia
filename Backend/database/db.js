import { Sequelize  } from "sequelize";

const sequelize = new Sequelize("postgres","postgres","admin", {
    host:"localhost",
    dialect:"postgres",
}

)
const connection = () => {
    try{
    sequelize.authenticate();
    console.log("database connected sucessfully");

    sequelize.sync({alter:true});

    }
    catch(e){
    console.log(e,"failed to connect to database");
    }
}

export {sequelize,connection}