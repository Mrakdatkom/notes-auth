import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // strip white spaces automatically
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be atleast 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
  },
  {
    timestamps: true,
  }
);

// pre('save') — runs BEFORE a document is saved to MongoDB
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

// post('save') — runs AFTER a document is saved successfully
userSchema.post('save', function (doc) {
  console.log(`New user saved: ${doc.email}`);
  // useful for logging, sending welcome emails, etc. 
});

userSchema.statics.findByEmail = async function (email) {
  const user = await this.findOne({ email: email.toLowerCase() });

  // Usage: const user = await User.findByEmail('ada@test.com')
  return user;
}

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid credentials.');
  }

  // Usage: const user = await User.login(email, password);
  return user;
}

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
  // Usage: const isMatch = await user.matchPassword(req.body.password)
};

userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
  // Usage: const publicProfile = user.getPublicProfile()
};

const User = mongoose.model("User", userSchema);

export default User;