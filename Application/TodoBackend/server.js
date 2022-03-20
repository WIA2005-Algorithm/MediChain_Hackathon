'use strict'
import {port, app} from './server_config.js';
import {MongoDB} from "./MongoDB.js";
import enrollRoute from './routes/userAuth.js';
import superUserRoute from './routes/createNetwork.route.js'
import { Superuser } from './models/Network.model.js';
// Connect to the database
MongoDB();
// Start the server
app.use('/api/users', enrollRoute);
app.use('/api/superuser', superUserRoute);
app.listen(port, ()=>{
    Superuser.findOne({username:'SuperAdmin'}).exec(function(_, doc){
        if (!doc){
            Superuser.create({username: 'SuperAdmin', password: 'SuperAdminpw'})
            .then(()=>console.log("Successfully created a superuser admin : SuperAdmin"))
            .catch((err)=> {
                console.log(err);
                process.exit(1);
            })
        }
    })
});
