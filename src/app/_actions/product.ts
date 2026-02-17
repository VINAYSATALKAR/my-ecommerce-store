"use server";

import { db } from "@/lib/db"; // We need to create this db file next
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
    // 1. Extract data from the form
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const imageUrl = formData.get("imageUrl") as string;

    // (We will handle categories later, for now let's hardcode or skip strict validation to test)
    // Ideally, you'd select a category ID from the database. 
    // For this first test, ensure you have at least one Category in your DB or we can create one dynamically.

    // 2. Save to Database
    await db.product.create({
        data: {
            name,
            description,
            price,
            images: [imageUrl],
            // We will need a category ID here. 
            // For the tutorial, let's create a "General" category if it doesn't exist
            category: {
                connectOrCreate: {
                    where: { name: "General" },
                    create: { name: "General" },
                },
            },
        },
    });

    // 3. Refresh the page data
    revalidatePath("/admin/products");

    // 4. Redirect back to products list
    redirect("/admin/products");
}