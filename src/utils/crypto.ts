import bcrypt from "bcryptjs";

const generateSalt = async (rounds: number = 12): Promise<string> => {
  return await bcrypt.genSalt(rounds);
};

const hashPasswordWithSalt = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export { generateSalt, hashPasswordWithSalt, comparePassword };
