import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },

    oauthProvider: { type: String }, // google, github
    oauthId: { type: String },

    department: { type: String },
    phone: { type: String },

    preferences: {
        pushNotifications: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: false
        },
        locationServices: {
            type: Boolean,
            default: true
        }
    },

    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SUPERADMIN'],
        default: 'USER'
    },

    // For manual auth if needed alongside OAuth
    password_hash: { type: String },

    warningCount: { type: Number, default: 0, max: 3 },
    isBanned: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash')) {
        next();
    }
    if (this.password_hash) {
        const salt = await bcrypt.genSalt(12);
        this.password_hash = await bcrypt.hash(this.password_hash, salt);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password_hash) return false;
    return await bcrypt.compare(enteredPassword, this.password_hash);
};

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
