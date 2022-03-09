import mongoose from 'mongoose';
const { Schema } = mongoose;

const Block_Network = mongoose.model(
    "Block_Network",
    new Schema({
        Name: {type: String, required: [true, 'Network name cannot be empty'], trim: true},
        Address: {
            type: String,
            validate: {
                validator: (v)=> /^[a-vx-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v),
                message: props => `${props.value} is not a valid organisation address!`
            },
            required: [true, "Network Address cannot be empty"],
            trim: true
        },
        Organizations: [Number]
    },
    {timestamps: true})
    )