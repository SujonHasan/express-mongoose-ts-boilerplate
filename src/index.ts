require("dotenv").config();
const mongoose = require("mongoose");
import logger from "@config/logger";
import app from "./app";

let server : any;

/**
 * mongoose.set('useNewUrlParser', true); // Use the new URL parser to avoid deprecation warnings and improve compatibility
 * mongoose.set('useUnifiedTopology', true); // Use the new Unified Topology layer for better connection management
 */

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{

    logger.info("connected to MongoDB");

    server = app.listen(process.env.HOST_PORT, ()=>{

        logger.info(`Listening to port ${process.env.HOST_PORT}`);
        
    })
}).catch((err) => console.log("Mongoose connection error : " + err))
