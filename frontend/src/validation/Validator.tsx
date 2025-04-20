export function validateFirstName(value: string): boolean {
  const regx = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/;
  return regx.test(value);
}
export function validateEmailId(value: string): boolean {
  const regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/;
  return regx.test(value);
}
export function validateDateOfBirth(value: string): boolean {
  const dob = new Date(value);
  const today = new Date();
  const minAgeDate = new Date();
  minAgeDate.setFullYear(today.getFullYear() - 18);
  return dob < minAgeDate ? true : false;
}
export function validatePassword(value: string): boolean {
  const regx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!?%^&])[A-Za-z\d@#$!?%^&]{8,16}$/;
  return regx.test(value);
}
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}
