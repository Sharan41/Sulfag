# BMAD Voice Integration - Quick Start Guide

## What is `/agent-vibes/bmad`?

The `/agent-vibes/bmad` command enables **text-to-speech (TTS) voices** for your BMAD agents. Each agent gets a unique voice, so you can distinguish them when they speak!

## Quick Start

### Step 1: Enable BMAD Voices

Simply run:
```
/agent-vibes/bmad enable
```

**What this does:**
- ✅ Assigns unique voices to each BMAD agent
- ✅ Backs up your current voice settings
- ✅ Automatically injects TTS into all BMAD agent files
- ✅ Agents will now **speak** when activated!

### Step 2: Activate a BMAD Agent

Try activating a BMAD agent:
```
/BMad:agents:pm
```

You should hear: 🔊 "Agent pm activated and ready" (spoken in the assigned voice)

## Available Commands

### `enable` - Turn on BMAD voices
```bash
/agent-vibes/bmad enable
```
Enables voice assignment and TTS injection for all BMAD agents.

### `disable` - Turn off BMAD voices
```bash
/agent-vibes/bmad disable
```
Restores your previous settings and removes TTS from agents.

### `status` - Check current status
```bash
/agent-vibes/bmad status
```
Shows whether the plugin is enabled and current voice mappings.

### `list` - List all agents and voices
```bash
/agent-vibes/bmad list
```
Displays all BMAD agents and their assigned voices.

### `set` - Change an agent's voice
```bash
/agent-vibes/bmad set pm "Aria"
/agent-vibes/bmad set dev "Cowboy Bob" sarcastic
```
Quickly change voice for a specific agent.

**Arguments:**
- `agent-id`: One of: `pm`, `dev`, `analyst`, `architect`, `sm`, `tea`, `tech-writer`, `ux-designer`, `bmad-master`
- `voice`: Valid AgentVibes voice name
- `personality` (optional): `normal`, `professional`, `sarcastic`, etc.

### `edit` - Manual editing
```bash
/agent-vibes/bmad edit
```
Opens the voice mapping file for manual editing.

## Available BMAD Agents

Your workspace has these BMAD agents that can be assigned voices:

| Agent ID | Role | Location |
|----------|------|----------|
| `pm` | Product Manager | `_bmad/bmm/agents/pm.md` |
| `dev` | Developer | `_bmad/bmm/agents/dev.md` |
| `analyst` | Business Analyst | `_bmad/bmm/agents/analyst.md` |
| `architect` | Architect | `_bmad/bmm/agents/architect.md` |
| `sm` | Scrum Master | `_bmad/bmm/agents/sm.md` |
| `tea` | Test Architect | `_bmad/bmm/agents/tea.md` |
| `tech-writer` | Technical Writer | `_bmad/bmm/agents/tech-writer.md` |
| `ux-designer` | UX Designer | `_bmad/bmm/agents/ux-designer.md` |
| `bmad-master` | BMAD Master | `_bmad/core/agents/bmad-master.md` |

## How It Works

### Voice Assignment
1. **Plugin File**: `.agentvibes/bmad/bmad-voices.md` contains voice-to-agent mappings
2. **Activation Flag**: `.agentvibes/bmad/bmad-voices-enabled.flag` enables/disables the plugin

### TTS Injection
When you run `enable`, the system:
1. Scans all BMAD agent files in `_bmad/` directories
2. Injects TTS hooks into each agent's activation instructions
3. Assigns voices based on the mapping file
4. Creates backups (`.backup-pre-tts`) before modifying

**Example of what gets injected:**
```yaml
activation-instructions:
  - STEP 4: Greet user with your name/role and immediately run `*help`
  - # AGENTVIBES-TTS-INJECTION: Speak agent greeting with assigned voice
  - Run this bash command to announce activation: .claude/hooks/play-tts.sh "Agent pm activated and ready" "Matthew Schmitz"
```

## Provider Support

The TTS works with any configured TTS provider:
- ✅ **Piper TTS** - AI voices with full voice mapping
- ✅ **Piper TTS** - Neural voices (free, offline)

Check your provider:
```bash
/agent-vibes:provider info
```

Switch providers:
```bash
/agent-vibes:provider switch
```

## Troubleshooting

### Plugin not found?
Run `enable` first - it will create the necessary files.

### Agents not speaking?
1. Check status: `/agent-vibes/bmad status`
2. Verify TTS provider: `/agent-vibes:provider info`
3. Try disabling and re-enabling: `/agent-vibes/bmad disable` then `enable`

### Want to restore original agent files?
The system creates `.backup-pre-tts` files before modifying. You can restore from these if needed.

## Example Workflow

```bash
# 1. Enable BMAD voices
/agent-vibes/bmad enable

# 2. Check status
/agent-vibes/bmad status

# 3. Activate an agent (it will speak!)
/BMad:agents:pm

# 4. Change a voice if needed
/agent-vibes/bmad set pm "Aria"

# 5. When done, disable
/agent-vibes/bmad disable
```

## Next Steps

1. **Enable the plugin**: `/agent-vibes/bmad enable`
2. **Test it**: Activate a BMAD agent and listen for the greeting
3. **Customize**: Use `set` or `edit` to assign your preferred voices
4. **Enjoy**: Have fun with your talking AI agents! 🎤

---

For more details, see: `.claude/commands/agent-vibes/bmad.md`





