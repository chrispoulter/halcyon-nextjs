const { createHash } = require('crypto');
const { Schema, model, models } = require('mongoose');

const userSchema = new Schema({
    emailAddress: { type: String, required: true, max: 254, unique: true },
    password: { type: String, max: 128 },
    firstName: { type: String, required: true, max: 50 },
    lastName: { type: String, required: true, max: 50 },
    dateOfBirth: { type: Date, required: true },
    passwordResetToken: { type: String, max: 36 },
    isLockedOut: { type: Boolean },
    roles: { type: [String] }
});

userSchema.virtual('picture').get(function() {
    const hash = createHash('md5')
        .update(this.emailAddress)
        .digest('hex');

    return `https://secure.gravatar.com/avatar/${hash}?d=mm`;
});

userSchema.set('versionKey', false);
userSchema.index({ '$**': 'text' });

module.exports = models.User || model('User', userSchema);
