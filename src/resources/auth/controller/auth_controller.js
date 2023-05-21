async function send_verification_again(req, res, next) {
    const { email } = req.body;
    try {
      const USER_FOUND = await USER.findOne({ email: email });
      if (!USER_FOUND) {
        return next(new CUSTOM_ERROR("User not found", 404));
      }
      if (USER_FOUND && USER_FOUND.verified) {
        return next(new CUSTOM_ERROR("You are already verified", 400));
      }
      await send_verification(USER_FOUND, next);
      return res.status(201).json({
        success: true,
        resource: "Verification email sent",
      });
    } catch (error) {
      next(error);
    }
  }