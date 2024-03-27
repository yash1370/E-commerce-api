import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // 1. read the token

  const token = req.headers["authorization"];
  // console.log("req.headers: ", req.headers);

  // 2.if no token, return the error

  // console.log("token: ", token);
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // 3.check if token is valid or not

  try {
    const payload = jwt.verify(token, "ejhefghdegvh");
    req.userId = payload.userID;
    console.log("payload: ", payload);
  } catch (error) {
    // 4. return error
    return res.status(401).send("Unauthorized");
  }
  // 5. call the next middleware
  next();
};

export default jwtAuth;
