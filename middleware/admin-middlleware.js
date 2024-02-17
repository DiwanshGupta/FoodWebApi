const adminMiddleware = async (req, res, next) => {
  try {
    console.log(req.user)
    const admin = req.user.isadmin;
    if (!admin) {
      return res
        .status(403)
        .json({ msg: "Access Denied! Unauthorized Access" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default adminMiddleware;
