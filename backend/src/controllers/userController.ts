// import { comparePasswords } from "../services/auth";
// import { signUserToken } from "../services/authService";

// export const loginUser = async (req, res, next) => {

//     try {
//         // Look up user by their username
//         let existingUser= await user.findOne({
//             where: { username: req.body.username }
//         });

//         // If user exists, check that password matches
//         if (existingUser) {
//             let passwordsMatch = await comparePasswords(req.body.password, existingUser.password);

//             // If passwords match, create a JWT
//             if (passwordsMatch) {
//                 let token = await signUserToken(existingUser);
//                 res.status(200).json(token);
//             }
//             else {
//                 res.status(203).json('Invalid password');
//             }
//         }
//         else {
//             res.status(203).json('Invalid username');
//         }
//     } catch {
//         res.status(500).send()
//     }
// }