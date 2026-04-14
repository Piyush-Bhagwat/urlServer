

export async function generateID() {
    const { nanoid } = await import("nanoid");
    let id = nanoid(10);
    return id;
}

