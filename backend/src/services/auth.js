import bcrypt from 'bcrypt';

export const hashPassword = async (plainTextPassword) => {
  const saltRound = 12;
  const hash = await bcrypt.hash(plainTextPassword, saltRound);
  return hash;
}

export const comparePasswords = async (plainTextPassword, hashPassword) => {
  return await bcrypt.compare(plainTextPassword, hashPassword);
}