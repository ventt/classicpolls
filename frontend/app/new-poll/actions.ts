"use server";

import {postgrest} from "@/lib/postgrest";
import {remark} from "remark";
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkLintNoHtml from "remark-lint-no-html";

export async function lintPollDescription(description: string) {
    // Lint markdown
    const lintResult = await remark()
        .use(remarkPresetLintConsistent)
        .use(remarkLintNoHtml)
        .process(description);

    return lintResult.messages.map(msg => `${msg.line}:${msg.column} ${msg.reason}`);
}

export async function createNewPoll(title: string, description: string, category_name: string) {
    const lintResult = await lintPollDescription(description);

    if (lintResult.length > 0) {
        const errors = lintResult.join('\n\n');
        throw new Error(`${errors}`);
    }

    const response = await (await postgrest()).from('poll').insert({
        title,
        description,
        category_name,
    }).select().single()

    if (response.error) {
        throw response.error;
    }

    return response.data.id
}