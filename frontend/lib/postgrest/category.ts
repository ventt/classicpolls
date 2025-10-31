import {postgrest} from "@/lib/postgrest";
import {CategoryTable} from "@/lib/model/category";

export const fetchCategories = async (): Promise<string[]> => {
    const response = (await (await postgrest())
        .from('category')
        .select()).data as CategoryTable[]


    // Convert to string array
    return response.map(cat => cat.name);
}
