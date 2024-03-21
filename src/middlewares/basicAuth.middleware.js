import UserModel from "../features/user/user.model.js";

const basicAuthorization = (req, res, next) => {
  const authHeader = req.headers["auth"];

  //   1. authorization header is empty

  if (!authHeader) {
    return res.status(401).send("No Authorization access");
  }
  console.log("authHeader: ", authHeader);

  //   2. Extract credentials
  const base64Credentials = authHeader.replace("Basic", "");
  console.log("base64Credentials: ", base64Credentials);

  //    3. Decode credentials
  const decodedCredentials = Buffer.form(base64Credentials, "base64").toString(
    "utf8"
  );
  console.log("decodedCredentials: ", decodedCredentials);
  const cred = decodedCredentials.split(":");

  const user = UserModel.getAll().find(
    (u) => u.email === cred[0] && u.password === cred[1]
  );
  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorization;
