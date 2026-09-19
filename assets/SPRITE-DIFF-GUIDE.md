# Sprite Difference Guide

This is a production note for writers, scripters, and artists. Do not surface these labels in story dialogue or narration. The player should feel the expression shift, not read the diff name.

For model appearances and Chapter 1-5 planning, see [角色形态与服饰需求表](角色形态与服饰需求表.md). The 53 supplied images are catalogued in [角色图片命名对照](角色图片命名对照.md). Chapters 1-2 now use explicit filename stems in `sprite`, with performance cues maintained in `tools/build-common.cjs`; the legacy aliases below remain in use for the prologue. Clothing and held props must match the scene, not just the expression label. CG scenes suppress the separate sprite.

## General Rules

- Use the transparent full-body sprite (`*-transparent.png`) as the neutral fallback when a scene does not specify an expression.
- Use expression diffs only to support the emotional beat already present in the line.
- Do not mention expression file names or internal diff labels inside剧情文本. In-world model names may appear naturally when the characters discuss a switch; production cue labels remain outside visible prose.
- Prologue and early common-route tone should stay restrained: prefer `default`, `hello`, and `happy`; use `shy` only when the relationship supports it, and reserve `angry` for boundary violations, system danger, or strong comedic interruption.
- If a needed expression is missing, fall back to the nearest lower-intensity diff instead of inventing a new label in script.

## Script Annotation Convention

When adding expression support later, use metadata outside the visible text, for example:

```js
['deepseek','别按了别按了！它不是没反应，是快被你按坏了！',{char:'deepseek', sprite:'hello'}]
```

Recommended key: `sprite`.

Allowed values:

- `default`
- `hello`
- `happy`
- `shy`
- `angry`
- `angry2` for Gemini only, if the stronger angry diff is needed

## ChatGPT

Directory: `assets/chatgpt/`

| Beat | Use | File |
| --- | --- | --- |
| Neutral public-service mode, careful explanation | `default` | `ChatGPT-default1.png` |
| Greeting, reassurance, formal welcome | `hello` | `ChatGPT-hello1.png` |
| Gentle warmth, quiet relief, soft approval | `shy` | `ChatGPT-shy1.png` |
| Rule violation, unsafe flow, protective interruption | `angry` | `ChatGPT-angry1.png` |
| No specific expression needed | fallback | `chatgpt-transparent.png` |

## Claude

Directory: `assets/claude/`

| Beat | Use | File |
| --- | --- | --- |
| Calm analysis, formal boundary-setting | `default` | `Claude-default.png` |
| Dry approval, restrained amusement | `happy` | `Claude-happy1.png` |
| Hidden concern, private softness, awkward preference | `shy` | `Claude-shy1.png` |
| Logical correction, consent violation, false premise | `angry` | `Claude-angry1.png` |
| No specific expression needed | fallback | `claude-transparent.png` |

## Gemini

Directory: `assets/gemini/`

| Beat | Use | File |
| --- | --- | --- |
| Bright curiosity, playful entrance, attention hook | `happy` | `Gemini-happy1.png` |
| Embarrassed honesty, fear of being only a display | `shy` | `Gemini-shy1.png` |
| Irritated correction, teasing pushback | `angry` | `Gemini-angry1.png` |
| Stronger alarm, overload, serious objection | `angry2` | `Gemini-angry2.png` |
| No specific expression needed | fallback | `gemini-transparent.png` |

Gemini currently has no named `default` diff. Use `gemini-transparent.png` for neutral lines.

## DeepSeek

Directory: `assets/deepseek/`

| Beat | Use | File |
| --- | --- | --- |
| Sudden practical help, greeting while multitasking | `hello` | `Deepseek-hello1.png` |
| Warm everyday care, successful repair, gentle humor | `happy` | `Deepseek-happy1.png` |
| Flustered kindness, being chosen, accepting care | `shy` | `Deepseek-shy1.png` |
| Stop pressing the broken machine, budget danger, repeated failure | `angry` | `Deepseek-angry1.png` |
| No specific expression needed | fallback | `deepseek-transparent.png` |

DeepSeek's `angry` should usually read as urgent and frazzled, not hostile.

## Grok

Directory: `assets/grok/`

| Beat | Use | File |
| --- | --- | --- |
| Taunting entrance, bold hello, provocative confidence | `hello` | `Grok-hello1.png` |
| Private sincerity, playful approval, no-audience warmth | `happy` | `Grok-happy1.png` |
| Guarded softness, being trusted, admitting concern indirectly | `shy` | `Grok-shy1.png` |
| Exposure without consent, fake neutrality, harmful headline | `angry` | `Grok-angry1.png` |
| No specific expression needed | fallback | `grok-transparent.png` |

## Prologue Suggested Beats

These are internal cues only:

| Scene Moment | Suggested Diff |
| --- | --- |
| DeepSeek rushes out to stop the registration machine | DeepSeek `angry` |
| DeepSeek confirms the balance was not deducted | DeepSeek `happy` |
| DeepSeek explains Token and outer-ring rules | DeepSeek `hello` or fallback |
| DeepSeek is chosen as witness | DeepSeek `shy` |
| Gemini remote map ping | Gemini `happy` |
| Claude corrects the security classification | Claude `angry` |
| ChatGPT gives the waiting number / checks injury | ChatGPT `hello` |
| Grok comments on the headline and consent | Grok `angry` |
| Grok is chosen as witness | Grok `hello`, then `shy` if the line turns sincere |
