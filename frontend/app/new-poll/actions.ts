"use server";


import {postgrest} from "@/lib/postgrest";

export async function createNewPoll(title: string, description: string, category_name: string) {
    const response = await (await postgrest()).from('poll').insert({
        title,
        description,
        category_name,
    })

    if (response.error) {
        throw response.error;
    }

    return true
}