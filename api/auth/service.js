import 'dotenv/config';
import User from '../users/model.js';


export const isAuthenticated = () => async (req, res) => { 
  if (!req.user) {
    res.status(401).send('Access Denied / Forbidden');
  } else {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      res.status(401).send('Access Denied / Forbidden');
    }
  }
};