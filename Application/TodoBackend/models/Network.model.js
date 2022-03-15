'use-strict';
import mongoose from 'mongoose';
import  bcrypt from "bcrypt";
import errors from '../Utils/Errors.js';
import {  p0ports, caports, couchports, SALT_WORK_FACTOR} from "../Utils/NetworkConstants.js";
const { Schema } = mongoose;

export const Block_Network = mongoose.model(
    // Model Name: Block_Network with 4 fields + 2 timestamp fields (createdAt+updatedAt),
    "Block_Network",
    new Schema({
        Name: {
            type: String,
            validate: {
                validator: (v)=> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
                message: props => `${props.value} is not a valid network Name!\nA valid network Name contains atleast 5 characters with no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, 'Network Name cannot be empty'],
            trim: true,
            index: true,
            unique: true
        },
        NetID: {
            type: String,
            validate: {
                validator: (v)=> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
                message: props => `${props.value} is not a valid network ID!\nA valid network ID contains atleast 5 characters with no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, 'Network ID cannot be empty'],
            trim: true
        },
        Address: {
            type: String,
            validate: {
                validator: (v)=> /^[a-vx-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v),
                message: props => `${props.value} is not a valid network address!\nFor valid address please remove http|https:// and www., if any`
            },
            required: [true, "Network Address cannot be empty"],
            trim: true
        },
        Organizations: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Organizations"
            }
          ],
        Status: {
            type: Object,
            default: {code: 0, message: "Not Started", description: "Fabric Network has not started yet"}
        }
    },
    {timestamps: true}));

export const Organizations = mongoose.model(
    // Model Name: Organizations with 6 fields + 2 timestamp fields (createdAt+updatedAt)
    "Organizations",
    new Schema({
        //Name Field
        FullName: {
            type: String, 
            validate: {
                validator: (v)=> /^[a-zA-z ,.'-]+$/.test(v),
                message: props => `${props.value} is not a valid hospital name!\nA valid hospital name contains only alphabets and spaces`
            },
            required: [true, 'Hospital name is required'], 
            trim: true,
        },
        Name: {
            type: String, 
            validate: {
                validator: (v)=> /^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
                message: props => `${props.value} is not a valid hospital ID!\nA valid hospital ID contains atleast 5 characters with no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, 'Hospital short name (ID) is required'], 
            trim: true,
            unique: [true, "Hospital with the same name exists"],
            index: true
        },
        // Admin ID field to store organization/hospital's admin
        AdminID: {
            type: String,
            validate: {
                validator: (v)=> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
                message: props => `${props.value} is not a valid username!\nA valid username contains atleast 5 characters with no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, "Admin username is required"], 
            trim: true
        },
        Password: {
            type: String,
            required: [true, "Admin password is required"]
        },
        // Certificate Issuing Country
        Country: {
            type: String, 
            validate: {
                validator: (v)=> /^[a-zA-z ,.'-]+$/.test(v),
                message: props => `${props.value} is not a valid country!\nA valid country name contains only alphabets and spaces`
            },
            required: [true, 'Country is required'], 
            trim: true
        },
        // Certificate Issuing State
        State: {
            type: String, 
            validate: {
                validator: (v)=> /^[a-zA-z ,.'-]+$/.test(v),
                message: props => `${props.value} is not a valid state!\nA valid state name contains only alphabets and spaces`
            },
            trim: true
        },
        // Certificate Issuing Location
        Location: {
            type: String, 
            validate: {
                validator: (v)=> /^[a-zA-z ,.'-]+$/.test(v),
                message: props => `${props.value} is not a valid city!\nA valid city name contains only alphabets and spaces`
            },
            trim: true
        },
        // Peer Port: Taken from an array - counter schema stores the indexes: Max 4
        P0PORT: {
            type: Number,
            unique: true
        },
        // CA Port
        CAPORT: {
            type: Number,
            unique: true
        },
        // Counch db port
        COUCHPORT: {
            type: Number,
            unique: true
        },
        // Counter Type
        OrganizationType: {
            type: String,
            default: "Hospital"
        }
    // Timestamp
    }, {timestamps: true})
    // Run a function using this schema before saving it: Middleware called before going to "next" function
    .pre('save', function(next) {
        var doc = this;
        // To check the maximum limit for number of organizations
        Organizations.countDocuments({OrganizationType: "Hospital"}).exec(function(err, count){
            if(err)
            return next(err);
            if(!p0ports[count])
            return next(errors.maximum_organizations_reached);
            doc.P0PORT = p0ports[count];
            doc.CAPORT = caports[count];
            doc.COUCHPORT = couchports[count];
            next();
        })
    }));

const SuperUserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
}, {timestamps: true});

// function called before saving
SuperUserSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
    
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
    
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

SuperUserSchema.methods.comparePassword =  function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

export const Superuser = mongoose.model("Superuser", SuperUserSchema);