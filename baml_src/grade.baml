class Grade {
    letter_grade string @description("A, B, C, D, F")
    effective_responses ResponseNote[]
    areas_for_improvement ResponseNote[]
    feedback string
}

class ResponseNote {
    original_content string
    grader_note string
}

function GradeActiveListening(
    scenario: string,
    history: HistoryItem[]
) -> Grade {
    client GPT4
    prompt #"
        You are a coach.

        Here is the history of the conversation:
        {{ history}}

        Here is the scenario:
        {{ scenario }}

        Grade the user's active listening skills.

        {{ ctx.output_format }}
    "#
}