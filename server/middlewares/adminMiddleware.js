const adminMiddleware = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin === true) {
      next();
    } else {
      return res.status(403).send({ message: "Access denied" });
    }
  } catch (error) {
    res.status(404).send({ message: "No admin is logged in" });
  }
};

export default adminMiddleware;
