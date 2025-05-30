const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const addressRegex = /^(?!\s*$).+/;
const emailRegex = /^[a-zA-Z0-9._-]{2,}@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
const mobileRegex = /^[0-9]+$/;
const youtubeLinkRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?([a-zA-Z0-9_-]{11})(\S*)?$/;

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

  if (!password || password.length <= 0) error = " is required";
  else if (password.length < 6) error = " must be atleast 6 characters";

  return error;
};

export const confirmPasswordValidator = (value, password) => {
  let error = "";

  if (!value || value.length <= 0) error = " is required";
  else if (value != password) error = " not match";

  return error;
};

export const youtubeLinkValidator = (link) => {
  let error = "";
  if (link.length >= 1 && !youtubeLinkRegex.test(link))
    error = "  is not valid";

  return error;
};

export const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};
