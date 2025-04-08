import { compare, hash } from "bcrypt";
import { email, minLength, object, pipe, string, type InferInput } from "valibot";
import fs from "fs";

//crear usuario de autenticacion con schemas: validaciones de los datos eg. formularios
//se crean schemas para email y password
const emailShema = pipe(string(), email()); //pipe de valibot: permite darle mas de una caracteristica
const passwordShema = pipe(string(), minLength(6));

//se unifican schemas
export const authSchema = object({
  email: emailShema,
  password: passwordShema,
});

/**
 * @enum Role - Enumeracion para definir los roles de los usuarios
 */
export enum Role {
  "ADMIN" = "admin",
  "USER" = "user"
}

//InferInput de valibot: permite inferir el tipo de dato
export type User = InferInput<typeof authSchema> & { //y se unifica coon Typescript
  id: number;
  role: Role;
  refreshToken?: string;  //indica que es opcional
}

/**
 * @interface Map - Se usa Map para indexar de manera directa los usuarios
 */
const User: Map<string, User> = new Map()

/**
 * Creates a new user with the given email and password.
 * The password is hashed before starting.
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @return {Promise<User>} - The created user
 */
/**
 * Creates a new user with the provided email and password.
 * The password is hashed before being stored, and the user is assigned
 * a default role of `Role.USER`.
 *
 * @param email - The email address of the user to be created.
 * @param password - The plain text password of the user to be hashed and stored.
 * @returns A promise that resolves to the newly created `User` object.
 *
 * @throws Will throw an error if hashing the password fails.
 */
export const createUser = async (
  email: string,
  password: string,
  role: Role
): Promise<User> => {
  const hashedPassword = await hash(password, 10) //encriptar password antes de guardarla en el backend con hash de bcrypt
  const newUser: User = {
    id: Date.now(), // timestamp para definir el id del usuario cuando se creo
    email,
    password: hashedPassword,
    role // asigna dinámicamente el rol que venga en la petición
  }
  User.set(email, newUser); //se guarda el usuario en el mapa
  return newUser; // return the created user
}

/**
 * Finds a user by their given email
 * 
 * @param {string} email - The email of the user to find
 * @return {User | undefined} - The user if found otherwise undefined if not found
 */
export const findUserByEmail = (email: string): User | undefined => {
  return User.get(email); //se busca el usuario por email
}

/**
 * validar contraseña del usuario
 * 
 * @param {User} user - The user whose password is to be validated
 * @param {string} password - The password to validate
 * @returns {Promise<boolean>} - True if the password is valid, false otherwise
 */
export const validatePassword = async (
  user: User,
  password: string
): Promise<boolean> => {
  return compare(password, user.password); //se compara el password con el password del usuario usando bcrypt
}

/**
 * Revoke token
 * 
 * @param {string} email - The email of the user to revoke the token
 * @returns {boolean} - True if the token is revoked, false otherwise
 */
export const revokeUserToken = (email: string): boolean => {
  const foundUser = User.get(email);
  if (!foundUser) {
    return false;
  }
  User.set(email, { ...foundUser, refreshToken: undefined }); //le borramos el token con undefined
  return true;
}