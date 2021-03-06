const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const mapFunctions = require('./maps');


module.exports = {
    
    async getUser(username){
        if (typeof(username) != 'string') throw 'Username must be a string';
        if (!username) throw 'Must provide username';
        
        let user=undefined;
        try{
            const usersCollection = await users();
            user = await usersCollection.findOne({"username":username});
        }catch(e){
            console.log("get user error: "+ e);
        }
        if (!user) throw "Error: No user found!";
        return user;
    },

    async getUserByEmail(username){
        if (typeof(username) != 'string') throw 'Email must be a string';
        if (!username) throw 'Must provide Email';
        
        let user=undefined;
        try{
            const usersCollection = await users();
            user = await usersCollection.findOne({"email":username});
        }catch(e){
            console.log("get user error: "+ e);
        }
        if (!user) throw "Error: No user found!";
        return user;
    },

    async createUser(user){
        if (!user.email || !user.username || !user.password) throw "Error: Must provide all fields (email, username, password)"
        if (!user.email.includes("@")) throw 'Error: Must provide valid email'
        if (typeof(user.email) != 'string') throw "Error: Email must be a string";
        if (typeof(user.username) != 'string') throw "Username must be a string";
        if (typeof(user.password) != 'string') throw "Password must be a string";
            //check unique email
            try{
                 await this.getUserByEmail(user.email.toLowerCase());
                 return;
            }catch(e){

            }
            //check unique username
            try{
                let try2 = await this.getUser(user.username);
                return;
           }catch(e){

           }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt);

        let newUser = {
            email: user.email,
            username: user.username,
            hashedPassword: hash,
            savedMaps: {}
        };
        let createdUser = undefined;
        try{
            const usersCollection = await users();
            
            createdUser = await usersCollection.insertOne(newUser);}
        catch(e){
            console.log("create user error:"+e);
        }
        if (createdUser.insertedCount === 0) throw `Error: The following user could not be created: ${newUser}`;
        const addedId = createdUser.insertedId;
        return await this.getUser(user.username).catch(function(e) {
            console.error(e)});
    },

    async saveGame(username, mapId, mapData, time, completed){
        if (!username) throw 'Error: Must provide username';
        if (typeof(username) != 'string') throw 'Error: username must be string';
        if (!Array.isArray(mapData)) throw "Error: Map data must be an array of arrays";
        mapData.forEach(element => {
            if(!Array.isArray(element)) throw "Error: Map data must be an array of arrays";
        });
        if (!mapId) throw "Error: Must provide mapId";
        if (typeof(mapId) == "string") mapId = ObjectId(mapId);
        if (!ObjectId.isValid(mapId)) throw "Error: Must provide mapId as ObjectId";
        if (!time) throw "Error: Must provide time";
        if (typeof(time) != "number") throw "Error: Must provide time as number";
        if (typeof(completed) != "boolean") throw "Error: Must provide completed as boolean";
        
        // Ensure map exists
        try{
            await mapFunctions.getMapById(mapId);
        } catch(e){
            console.log("save game error: "+e);
        }
        let newSaveData = {
                mapData: mapData,
                currentTime: time,
                completed: completed
            }
        try{
            const usersCollection = await users();
            const user = await this.getUser(username);
            let monogoField = `savedMaps.${mapId}`
            const savedMap = await usersCollection.updateOne({_id: user._id},{$set: {[monogoField]: newSaveData}});
        } catch(e){
            console.log("save game: "+e);
        }

    },

    async loadGame(username, mapId){
        if(!username) throw 'Error: Must provide username';
        if(typeof(username) != 'string') throw 'Error: username must be string';
        if(!mapId) throw "Error: Must provide mapId";
        if (typeof(mapId) == "string") mapId = ObjectId(mapId);
        if(!ObjectId.isValid(mapId)) throw "Error: Must provide mapId as ObjectId";
        
        try{
            const user = await this.getUser(username);
            return user['savedMaps'][mapId];
        } catch(e){
            console.log("load game :"+e) ;
        }
    },
}