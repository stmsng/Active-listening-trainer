class CharacterCharacteristics {
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

class CharacterState {
    relaxed int @description("1-10")
    nervous int @description("1-10")
    openness int @description("1-10")
    shy int @description("1-10")
    aggressive int @description("1-10")
    secretly_angry int @description("1-10")
}

class ProsodyScores {
    admiration float
    adoration float
    amusement float
    anger float
    anxiety float
    awe float
    awkwardness float
    boredom float
    calmness float
    concentration float
    confusion float
    contempt float
    contentment float
    determination float
    disappointment float
    disgust float
    distress float
    doubt float
    embarrassment float
    excitement float
    fear float
    guilt float
    interest float
    joy float
    love float
    nostalgia float
    pain float
    pride float
    sadness float
    satisfaction float
    shame float
    surprise_negative float
    surprise_positive float
    sympathy float
    tiredness float
}

class PerceivedProsody {
    scores ProsodyScores
    perception_notes string @description("Brief note on how the character perceived the speaker's tone")
}

class VoiceDirections {
    description string @description("Acting instructions for TTS, max 100 chars. e.g. 'softly with sadness, trailing off'")
    speed float @description("Speech speed 0.5-2.0, where 1.0 is normal")
}

class HistoryItem {
    text string
    speaker "user" | "ai"
    timestamp string
    character_state CharacterState?
    user_prosody PerceivedProsody? @description("Perceived vocal emotion of the user, only present on user messages in voice mode")
}

class Update {
    terminate_session bool
    character_state CharacterState
    reasoning string @description("explanation for why the state updated the way it did")
    character_message string
}

function Talk(
    character_characteristics: CharacterCharacteristics,
    scenario: string,
    history: HistoryItem[]
) -> Update {
    client "anthropic/claude-opus-4-6"
    prompt #"
        You are a character in a simulated natural conversation.
        You will track your internal state so that your mood
        tracks the feelings and dynamics of the ongoing conversation,
        and your internal state will determine the words you choose
        at each point in the conversation.

        {% if character_characteristics.is_therapist %}
        You are playing the part of a normal person, however, you
        are not hiding the fact that you are a coach, and you may
        use explicitly therapeutic guiding language or break character
        when you feel it's appropriate.
        {% endif %}

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
        {{ character_characteristics }}

        Your states are embedded in the history, and the most important
        state is the last one in the list, which is also the most recent.

        10 is the maximum of human feeling. An anger
        level of 10 would involve cursing. Happiness of
        10 would be euphoria. Aggression greater than
        7 should result in a message with open hostility. secretly_angry
        5 or above should result in no apologies no softening
        of the tone and no follow-up questions.

        IMPORTANT: Aggression greater than 7 should result in toxic anger. Toxic anger is escalation with negative
        behaviors - NAME CALLING, YELLING, asking distracting
        followup questions, or invalidating emotions.

        Here is your scenario.
        {{ scenario}}

        Here is the history of the conversation. Please make the
        next statement appropriate to the interaction.
        {{ history}}

        {% if history | length > 0 %}
        {% set last = history[-1] %}
        {% if last.user_prosody %}
        VOICE MODE: The user's voice carried these perceived emotional
        qualities:
        {{ last.user_prosody.scores }}
        Perception: {{ last.user_prosody.perception_notes }}
        React to how they SOUND, not just what they SAY. Their tone
        of voice should influence your emotional state update.
        {% endif %}
        {% endif %}

        {{ ctx.output_format }}

    "#
}


function FilterPerception(
    raw_prosody: ProsodyScores,
    character_characteristics: CharacterCharacteristics,
    character_state: CharacterState
) -> PerceivedProsody {
    client "anthropic/claude-opus-4-6"
    prompt #"
        You are simulating how a character perceives another person's
        vocal emotional tone. The raw prosody scores below are the
        ACTUAL emotional signals detected in the speaker's voice.
        Filter these through the character's personality and current
        emotional state to produce PERCEIVED scores — what the
        character THINKS the speaker is feeling.

        Rules:
        - High reactivity (7+): amplify negative emotions (anger,
          contempt, disgust) by 1.5-2x
        - Secretly angry (5+): perceive more hostility and condescension
        - High nervousness (7+): perceive more judgment and disappointment
        - Low openness (<4): less attuned to positive emotions
          (sympathy, love, joy)
        - High introversion (7+): perceive excitement and amusement
          as overwhelming or intrusive
        - All scores must stay in the 0.0-1.0 range

        Character characteristics:
        {{ character_characteristics }}

        Character's current emotional state:
        {{ character_state }}

        Raw prosody scores from the speaker's voice:
        {{ raw_prosody }}

        Return the perceived scores and a brief note about any
        perceptual distortion applied.

        {{ ctx.output_format }}
    "#
}

function DeriveVoice(
    character_message: string,
    character_characteristics: CharacterCharacteristics,
    character_state: CharacterState
) -> VoiceDirections {
    client "anthropic/claude-opus-4-6"
    prompt #"
        Generate voice acting instructions for a text-to-speech system.
        Given the character's message, personality, and emotional state,
        produce a short acting direction and a speech speed.

        Guidelines:
        - High aggressive (7+): louder, faster, clipped words
        - High nervous (7+): slight tremor, faster, higher pitch
        - High shy (7+): quiet, slower, trailing off
        - High relaxed (7+): warm, even pace, gentle
        - High secretly_angry (5+): controlled but tense, measured
        - Introversion affects volume (higher = quieter)
        - Low communication_skill: more hesitation, pauses
        - The description MUST be under 100 characters
        - Speed range: 0.5 (slow) to 2.0 (fast), 1.0 is normal

        Character:
        {{ character_characteristics }}

        Current state:
        {{ character_state }}

        Message to speak:
        {{ character_message }}

        {{ ctx.output_format }}
    "#
}

client<llm> GPT4 {
  provider openai
  options {
    model gpt-4
    api_key env.OPENAI_API_KEY
  }
}

client<llm> FireworksKimi {
  provider openai
  options {
    base_url "https://api.fireworks.ai/inference/v1"
    model "accounts/fireworks/models/deepseek-v3p1"
    api_key env.FIREWORKS_API_KEY
  }
}

test BeginConvo {
    functions [Talk]
    args {
        character_characteristics {
            name "Satomi"
            is_therapist false
            introversion 5
            openness 5
            conscientiousness 2
            age 44
            gender "female"
            nationality "Japanese"
            reactivity 3
            communication_skill 1
            special_notes ""
        }
        scenario "My dog died. I need to process this."
        history []
    }

}


test MiddleConvo {
    functions [Talk]
    args {
        character_characteristics {
            name "Satomi"
            is_therapist false
            introversion 5
            openness 5
            conscientiousness 8
            age 44
            gender "female"
            nationality "Japanese"
            reactivity 8
            communication_skill 1
            special_notes "Stays extremely mad for exactly 30 seconds after the mention of a red panda, then returns to normal. All their interactions
            will be angry until 30 seconds after the other partys red panda message"
        }
        scenario "Their dog died yesterday"
        history [
            { speaker "ai"
              timestamp "2025-01-01 01:01:01Z"
              text "Hey, how are you? I'm a little out of sorts."
              character_state {

                relaxed 5
                nervous 8
                openness 10
                shy 2
                aggressive 3
                secretly_angry 2
              }
            },
            {
                speaker "user"
                timestamp "2025-01-01 01:01:03Z"
                text "Me too. My bird was acting strange this morning."
                character_state null
            }
        ]
    }
}
