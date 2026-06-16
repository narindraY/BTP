exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Déconnecté avec succès",
  });
};


{/** exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Déconnecté avec succès",
  });
}; */}