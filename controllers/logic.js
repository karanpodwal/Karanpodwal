
const User = required("../models/user.js");

const bcrypt = required("bcrypt");




function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided',
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Invalid token',
            });
        }

        req.user = user;
        next();
    });
}



exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

  
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            user: newUser,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered',
        });
    }
};

exports.login = async(req,res)=>{
  
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const payload = { email: user.email, id: user._id };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

        return res.status(200).json({
            success: true,
            token,
            user,
            message: 'User logged in successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be logged in',
        });
    }
}







exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

       
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

      
        const resetToken = uuidv4();
        const resetExpires = new Date(Date.now() + 5 * 60 * 1000); 

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        
        const resetLink = `http://your-reset-link.com/resetpassword?token=${resetToken}`;
        const mailOptions = {
            from: 'your.email@gmail.com',
            to: user.email,
            subject: 'Reset Your Password',
            text: `Click on the following link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Error sending reset password email',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Reset password email sent successfully',
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error initiating password reset',
        });
    }
};



exports.userfindID =async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: 'User details retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving user details',
        });
    }
};