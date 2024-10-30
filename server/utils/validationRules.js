const EMAIL_RGX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PASSWORD_RGX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const isUserBetween18and67 = (birthday) => {
  const currentDate = new Date();
  const birthDate = new Date(birthday);
  const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();
  const userAgeResult = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
  if (userAgeResult >= 18 && userAgeResult <= 67) {
    return true;
  }
};

export const isEmailValid = (email) => {
  return EMAIL_RGX.test(email);
};

export const isPasswordValid = (password) => {
  return PASSWORD_RGX.test(password);
};
