const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-2);
  const maskedLength =
    localPart.length - visibleStart.length - visibleEnd.length;
  const masked = "⁕".repeat(Math.max(0, maskedLength));
  return `${visibleStart}${masked}${visibleEnd}@${domain}`;
};

export default maskEmail;
