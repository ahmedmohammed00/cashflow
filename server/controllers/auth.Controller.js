import User from '../models/user.Model.js';
import Organization from '../models/organization.Model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user and create an organization for them
// @route   POST /api/auth/register

export const registerUser = async (req, res) => {
    console.log('🔍 req.body:', req.body); // 👈 Add this line

    const { name, email, password, organizationName, mobileNumber } = req.body;
    if (!req.body) {
        return res.status(400).json({ error: '❌ req.body is undefined' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        // Check for Validation : precense of @ in email
        if(!email || !email.includes('@')){
            return res.status(400).json({ msg: 'Email is Required' });
        }
        if(!password  || password.length < 6)
        {
            return res.status(401).json({ msg: 'Password is required' });
        }
        if(!mobileNumber || mobileNumber.length < 10)
        {
            return res.status(400).json({ msg: 'Mobile Number is required' });
        }


        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create a new organization for the user
        const organization = new Organization({
            name: organizationName || `${name}'s Business`,
        });
        await organization.save();

        // Create a new user associated with the organization
        // The user will have a 'pending' status by default from the schema
        user = new User({
            name,
            email,
            password,
            mobileNumber,
            organization: organization._id,
            // First registered user becomes the admin of their org
            role: 'admin'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Do not return a token. User must be approved first.
        res.status(201).json({ success: true, message: 'Registration successful. Your account is pending approval.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists and populate their organization
        let user = await User.findOne({ email }).populate('organization');
        console.log(user);
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        // Check user status before proceeding
        if (user.status === 'pending') {
            return res.status(403).json({ success: false, error: 'Your account is pending approval.' });
        }
        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, error: 'Your account has been suspended.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                organization: user.organization._id,
                name: user.name,
                email: user.email,
                organizationName: user.organization.name
            }
        };
        console.log(payload);
        jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;

            res.cookie('__Security_access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // true if HTTPS
                maxAge: 3600000, // 1 hour
                sameSite: 'Strict'
            });



            res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    organization: user.organization
                }
            });
        });


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get logged in user
// @route   GET /api/auth
// @access  Private (requires a middleware to verify token)
export const getMe = async (req, res) => {
    try {
        // req.user is set by the auth middleware and should include the organization
        const user = await User.findById(req.user.id).select('-password').populate('organization');
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};