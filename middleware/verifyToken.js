import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    //console.log("token received from front end", token);

    if (!token) return res.status(401).json({ message: "Not Authorized" });

    const authorized = jwt.verify(token, process.env.JWT_SECRET);

    console.log(authorized.email);
    console.log(req);
    if (authorized) {
      console.log("coming inside authorised");
      req.userEmail = authorized.email;
      next();
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
    //we will call next only when if it is a valid
  } catch (err) {
    res.status(402).json({ message: err.message });
  }

  //if token is not valid we will send a bad request response back to the front end
};
