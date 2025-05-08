

export const signUpUser = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error, 'signup error');
        return res.status(500).json({ message: 'Error while SignUp' });
    }
}

export const loginUser = async (req, res, next) => {

}
