import bcrypt from 'bcryptjs';

class Encrypt {
  async hashPassword(password: string): Promise<string> {
    console.log(password);
    const bcryptSalt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, bcryptSalt);
    return hashed;
  }

  async comparePassword(password: string, testPassword: string): Promise<boolean> {
    const matchPassword = await bcrypt.compare(password, testPassword);
    return matchPassword;
  }
}
export default Encrypt;
