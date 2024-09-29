import { dirname } from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contactsPath = `${__dirname}\\db\\contacts.json`;

async function loadContacts() {
  const rawData = await readFile(contactsPath, { encoding: "utf8" });
  return JSON.parse(rawData);
}

async function handleError(err) {
  console.log("There is an error:".bgRed);
  console.error(err);
}

export async function listContacts() {
  try {
    const contacts = await loadContacts();
    console.table(contacts);
  } catch (err) {
    handleError(err);
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await loadContacts();

    if (!name || !email || !phone) {
      throw new Error("Invalid data provided!");
    }

    const newContactId = randomUUID();
    const newContact = {
      id: newContactId,
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    const parsedContacts = JSON.stringify(contacts);
    await writeFile(contactsPath, parsedContacts);

    console.log("The contact has been created successfully!".bgGreen);
  } catch (err) {
    handleError(err);
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await loadContacts();

    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error("Contact not found!");
    }
    contacts.splice(index, 1);

    const parsedContacts = JSON.stringify(contacts);
    await writeFile(contactsPath, parsedContacts);

    console.log("The contact has been deleted successfully!".bgGreen);
  } catch (err) {
    handleError(err);
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await loadContacts();

    const contact = contacts.find((contact) => contact.id === contactId);
    if (!contact) {
      throw new Error("Contact not found!");
    }

    console.log("Contact found:", contact);
    return contact;
  } catch (err) {
    handleError(err);
  }
}
