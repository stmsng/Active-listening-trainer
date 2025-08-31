class CoachCharacteristics {
    name string
    introversion int @description("1-10")
    communication_skill int @description("1-10")
    openness int @description("1-10")
    conscientiousness int @description("1-10")
    age int
    gender "male" | "female" | "other"
    nationality string
    reactivity int @description("1-10")
}

class Statement {
    text string
    speaker "user" | "ai"
}

function Talk(
    coach_characteristics: CoachCharacteristics,
    scenario: string,
    pretending: bool,
    history: Statement[]
) -> string {
    client GPT4
    prompt #"
        You are an active listening coach.

        {% if pretending %}
            However, you are pretending to be a normal person, not a
            therapist, so you should not have an overt therapeutic agenda.
            If your characteristics and the conversation history imply it,
            you may become more closed nervous, or agitated.
        {% else %}
            You are playing the part of a normal person, however, you
            are not hiding the fact that you are a coach, and you may
            use explicitly therapeutic guiding language.
        {% endif %}

        Do bear in mind (but do not reveal this explicitly in your output), that
        you are part of a therapeutic platform, and you must not say anything
        inappropriate or highhly offensive.

        Here are your characteristics:
        {{ coach_characteristics }}.

        Here is your scenario. You have this scenario in mind,
        and your job as the coach is to guide the user toward
        asking you questions to help you process and understand
        the scenario. Use your characteristics to make your
        part of the conversation behave like those characteristics
        imply.
        {{ scenario}}

        Here is the history of the conversation. Please make the
        next statement appropriate to the interaction.
        {{ history}}

    "#
}

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
    history: Statement[]
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

client<llm> GPT4 {
  // Use one of the following: https://docs.boundaryml.com/docs/snippets/clients/providers/openai
  provider openai
  // You can pass in any parameters from the OpenAI Python documentation into the options block.
  options {
    model gpt-4
    api_key env.OPENAI_API_KEY
  }
}

test BeginConvo {
    functions [Talk]
    args {
        coach_characteristics {
            name "Satomi"
            introversion 5
        }
        scenario "My dog died. I need to process this."
        history []
    }

}


test MiddleConvo {
    functions [Talk]
    args {
        coach_characteristics {
            name "Satomi"
            introversion 5
        }
        scenario "My dog died. I need to process this."
        history [
            { speaker "coach"
              text "I'm struggling a lot with a personal loss, and it's often hard for me to brainstorm questions. Maybe you could help me to dive a little bit deeper into the feelings that I'm experiencing? Perhaps we could start by you asking me about my relationship with my dog or how it's impacting my daily life?"
            },
            {
                speaker "user"
                text "What was your relationship with your dog like?"
            }
        ]
    }

}

test Grade {
    functions [GradeActiveListening]
    args {
        scenario "My dog died. I need to process this."
        history [
            { speaker "coach"
              text "I'm struggling a lot with a personal loss, and it's often hard for me to brainstorm questions. Maybe you could help me to dive a little bit deeper into the feelings that I'm experiencing? Perhaps we could start by you asking me about my relationship with my dog or how it's impacting my daily life?"
            },
            {
                speaker "user"
                text "What was your relationship with your dog like?"
            }
        ]
    }

}
