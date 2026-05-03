# Cyberpunk Character Generator — RED Rules Rebuild

## Bugs to Fix (Must Do)

### 1. Stats System — Switch to Cyberpunk RED (10 attributes)
**Current:** 6 stats (STR, AGL, INT, CYW, CHR, TEC), rolled 1-100 with bias
**Target:** 10 stats — INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP
- Range: 2-8 at character creation
- Total point pool (Complete Package): **62 points**
- No stat may exceed 8 or go below 2
- Update types.ts, classes.ts, generator.ts, CharacterCard.tsx

### 2. Illegal Stats — Reroll Generates Wild Numbers
**Current:** `generateStats()` rolls 20-75 + bias + noise = values 1-100 (illegal in RED)
**Target:** Reroll must generate a **legal 62-point Complete Package** character
- Distribute 62 points across 10 stats, each 2-8
- Role-weighted random distribution (bias toward role-relevant stats)
- Can also offer preset templates (Streetrat, Edgerunner, Solo Opt, Netrunner Opt)

### 3. No Role Selection — Random Role Every Time
**Current:** Role is randomly picked, user can't choose
**Target:** Dropdown selector with all 9 Cyberpunk RED roles
- Solo, Netrunner, Rockerboy, Tech, Medtech, Media, Exec, Lawman, Fixer
- Role ability rank starts at **4**
- Auto-suggest optimal stat distribution when role changes
- Role-appropriate color scheme for the card

## Features to Add (Should Do)

### 4. Stat Editor — Interactive Sliders with Validation
- Replace passive stat bars with interactive controls (sliders or number inputs)
- Constrained 2-8 per stat
- Real-time remaining points counter (62/62 — large, colored)
- Validation errors: "Total must be exactly 62", "No stat below 2", "No stat above 8"
- Disable Generate until character is valid

### 5. Derived Stats — Auto-Calculated
- Hit Points = (BODY + WILL) × 5
- Humanity = EMP × 10 (before cyberware)
- Seriously Wounded Threshold = HIP / 2 (rounded down)
- Death Save = BODY
- Initiative = REF + DEX
- Display on the character card

### 6. Role Ability Display
- Each role has a unique ability, rank starts at 4
- Solo = Combat Awareness, Netrunner = Interface, etc.
- Show role ability name + rank on the character card

## Stretch Goals (If Time Permits)
- Cyberware selector with humanity loss calculation
- Export as JSON
- Lifepath integration (Cultural Origin, Personality, Background)
- Character creation method toggle (Streetrat, Edgerunner, Complete Package)

## Validation Rules
- `Total stats must be exactly 62`
- `No stat may exceed 8`
- `No stat may be below 2`
- Generate/Save button is disabled until valid

## User Stories
- As a user, I want to see a proper Cyberpunk RED character sheet with all 10 attributes
- As a user, I want to choose my role and see suggested stat distributions
- As a user, I want real-time validation so I can't make an illegal character
- As a user, I want REROLL to give me a legal character, not insane numbers
- As a user, I want derived stats auto-calculated from my attributes
