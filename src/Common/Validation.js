const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const addressRegex = /^(?!\s*$).+/;
const emailRegex = /^[a-zA-Z0-9._-]{2,}@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
const mobileRegex = /^[0-9]+$/;

export const nameValidator = (name) => {
  let error = "";

  if (!name || name.length <= 0) error = " is required";
  else if (!nameRegex.test(name) || name.length < 3) error = " is not valid";

  return error;
};
export const lastNameValidator = (name) => {
  let error = "";

  if (!name || name.length <= 0) error = " is required";
  else if (!nameRegex.test(name)) error = " is not valid";

  return error;
};
export const addressValidator = (name) => {
  let error = "";
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length <= 0) error = " is required";
  else if (!addressRegex.test(trimmedName) || trimmedName.length < 2)
    error = " must be 2 characters";

  return error;
};

export const emailValidator = (email) => {
  let error = "";

  if (!email || email.length <= 0) error = " is required";
  else if (!emailRegex.test(email)) error = " is not valid";

  return error;
};
export const mobileValidator = (mobile) => {
  let error = "";

  if (!mobile || mobile.length <= 0) error = " is required";
  else if (!mobileRegex.test(mobile) || mobile.length < 10)
    error = " is not valid";
  return error;
};

export const selectValidator = (name) => {
  let error = "";

  if (!name || name.length <= 0) error = " is required";

  return error;
};

export const passwordValidator = (password) => {
  let error = "";

  if (!password || password.length <= 0) error = "Password is required";
  else if (password.length < 3) error = " Password is not valid";

  return error;
};
