import mongoose from 'mongoose';
const { Schema } = mongoose;

const Block_Network = mongoose.model(
    "Block_Network",
    new Schema({
        Name: {
            type: String,
            validate: {
                validator: (v)=> /^[a-z ,.'-]+$/.test(v),
                message: props => `${props.value} is not a valid network name!\nA valid network ID contains no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, 'Network ID cannot be empty'],
            trim: true},
        NetID: {
            type: String,
            validate: {
                validator: (v)=> /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(v),
                message: props => `${props.value} is not a valid network ID!\nA valid network ID contains no spaces, no special characters in the beginning or end. \nAllowed special characters include 'underscore' and 'dot'`
            },
            required: [true, 'Network ID cannot be empty'],
            trim: true},
        Address: {
            type: String,
            validate: {
                validator: (v)=> /^[a-vx-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v),
                message: props => `${props.value} is not a valid organisation address!\nFor valid blockchain address please remove http|https:// and www., if any`
            },
            required: [true, "Network Address cannot be empty"],
            trim: true
        },
        // LEFT HERE
        Organizations: [Number]
    },
    {timestamps: true})
    )