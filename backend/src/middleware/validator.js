const sanitizeChatInput = (req, res, next) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid question related to MGMU IICT."
    });
  }

  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Question cannot be empty. Please ask a question about MGMU IICT."
    });
  }

  if (trimmed.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Question is too long (maximum 1000 characters). Please shorten your inquiry."
    });
  }

  req.body.sanitizedQuestion = trimmed;
  next();
};

module.exports = {
  sanitizeChatInput
};
