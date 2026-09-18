# Transparent Sprite Extraction

Method: built-in imagegen tool, background-extraction edit mode. Original source PNGs remain unchanged. Outputs have genuine alpha channels; rendering no longer relies on multiply blending to hide white backgrounds.

| Source | Extracted Sprite |
| --- | --- |
| `chatgpt/chatgpt.png` | `chatgpt/chatgpt-transparent.png` |
| `claude/claude.png` | `claude/claude-transparent.png` |
| `gemini/gemini.png` | `gemini/gemini-transparent.png` |
| `deepseek/deepseek.png` | `deepseek/deepseek-transparent.png` |
| `grok/grok.png` | `grok/grok-transparent.png` |

The same prompt was used for each source, in a separate image-editing call:

> Use case: background-extraction. Edit target: attached full-body character image. Remove ONLY the plain white background and make it genuinely transparent with an alpha channel. This is a game sprite extraction, NOT a redesign. Preserve the exact existing character drawing, face, pose, linework, proportions, original colors, all pale/white hair and white clothing, accessories, tails, weapons and floating companions. Preserve the complete full-body silhouette and all original details. No crop, no new shadows, no background, no checkerboard painted into pixels. Output a transparent PNG full-body sprite. Keep all non-background pixels as unchanged as possible.

The tool resampled the output dimensions. These files are extraction derivatives, not byte-identical copies of the sources. The originals remain available for later production-quality art work.

For internal expression-diff usage recommendations, see `SPRITE-DIFF-GUIDE.md`. Diff labels are production metadata and should not appear in visible story text.
