import { hash, compare } from 'bcryptjs';


export async function hashPassword(mypassword) {
  try {
    const hashedPassword = await hash(mypassword, 10);
    console.log('Password hash:', hashedPassword);
    return hashedPassword
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

export async function comparePasswords(mypassword, hashedPassword) {
  try {
    
    const result = await compare(mypassword, hashedPassword);
    console.log('Password match:', result);
    return result;
  } catch (err) {
    console.error('Error comparing password:', err);
    throw err;
  }
}
