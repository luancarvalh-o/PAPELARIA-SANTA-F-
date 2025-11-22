// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next()
  }
  return res.status(401).json({ success: false, error: "Não autenticado" })
}

function ensureAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.isAdmin) {
    return next()
  }
  return res.status(403).json({ success: false, error: "Acesso negado. Apenas administradores" })
}

module.exports = { ensureAuthenticated, ensureAdmin }
