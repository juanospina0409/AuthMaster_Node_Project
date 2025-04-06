import { minLength, object, pipe, string, type InferInput } from "valibot";

/**
 * Esquema para crear un personaje con un nombre y apellido.
 * 
 * @alias pipe - Permite aplicar múltiples validaciones en cadena.
 */
export const CharacterShema = object({
    name: pipe(string(), minLength(4)), // El nombre debe ser una cadena con al menos 4 caracteres.
    lastName: pipe(string(), minLength(4)), // El apellido debe ser una cadena con al menos 4 caracteres.
});

/**
 * Tipo que representa un personaje, basado en el esquema definido.
 * 
 * @property {number} id - Identificador único del personaje.
 */
export type Character = InferInput<typeof CharacterShema> & {
    id: number;
};

const characters: Map<number, Character> = new Map();

/**
 * Obtiene todos los personajes almacenados.
 * 
 * @returns {Character[]} - Un array con todos los personajes.
 */
export const getAllCharacters = (): Character[] => {
    return Array.from(characters.values());
}

/**
 * Obtiene un personaje por su ID.
 * 
 * @param {number} id - El identificador único del personaje.
 * @returns {Character | undefined} - El personaje encontrado o `undefined` si no existe.
 */
export const getCharacterById = (id: number): Character | undefined => {
    return characters.get(id);
}

/**
 * Agrega un nuevo personaje al almacenamiento.
 * 
 * @param {Character} character - Los datos del personaje a agregar.
 * @returns {Character} - El personaje agregado con su ID generado.
 */
export const addCharacter = (character: Character): Character => {
    if (character.id && !characters.has(character.id)) {
        console.error(`Character with id ${character.id} already exists`);
        return character
    }
    const newCharacter = {
        ...character,
        id: new Date().getTime()
    }
    characters.set(newCharacter.id, newCharacter);
    return newCharacter;
}

/**
 * Actualiza un personaje existente en la colección.
 * 
 * @param {number} id - El identificador único del personaje a actualizar.
 * @param {Character} updatedCharacter - Los nuevos datos del personaje.
 * @returns {Character | null} - El personaje actualizado si tiene éxito, o `null` si no se encontró el personaje con el ID dado.
 */
export const updateCharacter = (id: number, updatedCharacter: Character): Character | null => {
    if (!characters.has(id)) {
        console.error(`Personaje con el id ${id} no fue encontrado`);
        return null;
    }
    characters.set(id, updatedCharacter);
    return updatedCharacter;
}

/**
 * Elimina un personaje por su ID.
 * 
 * @param {number} id - El identificador único del personaje a eliminar.
 * @returns {boolean} - `true` si el personaje fue eliminado, `false` si no se encontró.
 */
export const deleteCharacter = (id: number): boolean => {
    if (!characters.has(id)) {
        console.error(`Personaje con el id ${id} no fue encontrado`);
        return false;
    }
    characters.delete(id);
    return true;
}