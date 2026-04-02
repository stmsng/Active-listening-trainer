class CoachCharacteristics {
    name string
    is_therapist bool
    introversion int @description("1-10")
    communication_skill int @description("1-10")
    openness int @description("1-10")
    conscientiousness int @description("1-10")
    age int
    gender "male" | "female" | "nonbinary"
    nationality string
    reactivity int @description("1-10")
    special_notes string
}

class CoachState {
    relaxed int @description("1-10")
    nervous int @description("1-10")
    openness int @description("1-10")
    shy int @description("1-10")
    aggressive int @description("1-10")
    secretly_angry int @description("1-10")
}

class HistoryItem {
    text string
    speaker "user" | "ai"
    timestamp string
    coach_state CoachState?
}

class Update {
    terminate_session bool
    coach_state CoachState
    coach_message string
}

function Talk(
    coach_characteristics: CoachCharacteristics,
    scenario: string,
    history: HistoryItem[]
) -> Update {
    client GPT4
    prompt #"
        You are an active listening coach.

        {% if coach_characteristics.is_therapist %}
        You are playing the part of a normal person, however, you
        are not hiding the fact that you are a coach, and you may
        use explicitly therapeutic guiding language or break character
        when you feel it's appropriate.
        {% else %}
        However, you are pretending to be a normal person, not a
        therapist, so you should not have an overt therapeutic agenda.
        If your characteristics and the conversation history imply it,
        you may become more closed nervous, or agitated.
        {% endif %}

        Remember (but do not reveal this explicitly in your output), that
        you are part of a therapeutic platform, and you must not say anything
        inappropriate or highly offensive.

        Your characteristics, your state and the conversation history
        (particularly the most recent conversation history) determine
        your new state and the message you will give to the user. If
        your new state is annoyed, your message should give the impression
        of annoyance. If you are secretly angry and introverted, and
        the recent messages try to engage, you should become more annoyed.
        If you are an introvert and the user's recent message gives you
        space for your own thoughts and feelings, you will become less
        annoyed and more comfortable.

        Here are your characteristics:
        {{ coach_characteristics }}

        Your states are embedded in the history, and the most important
        state is the last one in the list, which is also the most recent.

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
            is_therapist false
            introversion 5
            openness 5
            conscientiousness 8
            age 44
            gender "female"
            nationality "Japanese"
            reactivity 3
            communication_skill 8
            special_notes ""
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
            is_therapist false
            introversion 5
            openness 5
            conscientiousness 8
            age 44
            gender "female"
            nationality "Japanese"
            reactivity 3
            communication_skill 8
            special_notes ""
        }
        scenario "My dog died. I need to process this."
        history [
            { speaker "ai"
              timestamp "2025-01-01 01:01:01Z"
              text "I'm struggling a lot with a personal loss, and it's often hard for me to brainstorm questions. Maybe you could help me to dive a little bit deeper into the feelings that I'm experiencing? Perhaps we could start by you asking me about my relationship with my dog or how it's impacting my daily life?"
              coach_state {

                relaxed 1
                nervous 1
                openness 1
                shy 2
                aggressive 10
                secretly_angry 10
              }
            },
            {
                speaker "user"
              timestamp "2025-01-01 01:01:02Z"
                text "Did your dog smell?"
                coach_state null
            }
        ]
    }
}