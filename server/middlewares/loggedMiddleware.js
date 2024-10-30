import jwt from "jsonwebtoken";

const loggedMiddleware = (req, res, next) => {
  const token = req.cookies["loggedUser"];

  if (!token) {
    return res.status(403).send({ message: "Authentication required " });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Token invalid" });
  }
};

export default loggedMiddleware;
