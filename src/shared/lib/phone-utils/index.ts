export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("996")) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
  }

  return phone;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?996)?[0-9\s]{9,12}$/;
  return phoneRegex.test(phone);
};

export const cleanPhone = (phone: string): string => {
  return phone.replace(/\s/g, "");
};
