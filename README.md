# Railways - Route Designer Puzzle Game

## Student Declaration

I declare that this solution is my own work. I have not copied from any other student's work or from any other source except where due acknowledgment is made explicitly in the text, nor has any part been written for me by another person.

**Student Name:** [Your Name Here]  
**Date:** [Date]

---

## Game Description

Railways is a logic puzzle game where players must create a continuous circular railway line on a grid. The objective is to connect all required terrain elements (mountains and bridges) while avoiding oases, forming a complete loop.

### Game Features

- **Two Difficulty Levels:**
  - Easy: 5x5 grid
  - Hard: 7x7 grid
- **Multiple Levels:** 5 different maps for each difficulty
- **Terrain Types:**
  - Empty tiles (optional placement)
  - Mountains (must have mountain rails)
  - Bridges (must have bridge rails)
  - Oases (cannot place rails)
- **Rail Types:**
  - Straight Rails (for empty tiles)
  - Curve Rails (for empty tiles)
  - Bridge Rails (for bridge terrain)
  - Mountain Rails (for mountain terrain)

---

## How to Play

1. **Start Screen:** The game begins with a splash screen, then transitions to the main menu
2. **Setup:**
   - Enter your name
   - Select difficulty (5x5 Easy or 7x7 Hard)
   - Click "Start Game"
3. **Gameplay:**
   - **Left Click:** Place selected rail on a tile
   - **Right Click:** Rotate placed rail 90° clockwise
   - Select rail types from the palette on the right
4. **Win Condition:**
   - All mountains and bridges must have rails
   - All rails must form one continuous loop
   - Rails must connect properly (matching exits)

---

## Implementation Checklist

### Basic Requirements (Mandatory)

- [X] **User Interface Design**
  - [X] Static HTML structure created
  - [X] CSS styling for all elements
  - [X] Square grid implementation that scales properly
  - [X] Responsive design (works at 1024x768+)
  - [X] Terrain elements displayed (using background images)

- [X] **Game Logic - Data**
  - [X] Grid represented as matrix
  - [X] Terrain data stored (mountains, bridges, oases, empty)
  - [X] Placed rails tracked separately
  - [X] Rotation data stored for each cell
  - [X] Timer data (elapsed time)
  - [X] Player name stored

- [X] **Game Logic - Operations**
  - [X] Initial game state setup
  - [X] Rail placement logic
  - [X] Rail rotation logic
  - [X] Puzzle validation logic
  - [X] Timer functionality

- [X] **Event Handlers**
  - [X] Difficulty selection
  - [X] Name input validation
  - [X] Start game button
  - [X] Rail selection from palette
  - [X] Cell click for placement
  - [X] Right-click for rotation
  - [X] Rules popup
  - [X] Back to menu functionality

- [X] **Game Features**
  - [X] 5x5 grid (Easy mode)
  - [X] 7x7 grid (Hard mode)
  - [X] Multiple level maps (5 easy, 5 hard)
  - [X] Player name display
  - [X] Elapsed time counter
  - [X] Rail placement with validation
  - [X] Rail rotation (90° increments)
  - [X] Win condition detection
  - [X] Continuous loop validation

### Code Quality

- [X] No `var` keyword used (only `let` and `const`)
- [X] No inline JavaScript in HTML
- [X] No `DOMContentLoaded` used
- [X] Uses `querySelector`/`querySelectorAll` (not `getElementById`)
- [X] No `prompt` or `alert` used
- [X] No JavaScript frameworks (vanilla JS only)
- [X] Clean, readable code structure

### Advanced Features Implemented

- [X] Visual feedback for selected rail type
- [X] Notification system for user feedback
- [X] Smooth transitions and animations
- [X] Proper terrain-rail matching validation
- [X] Complete loop validation algorithm
- [X] Random level selection
- [X] Professional UI/UX design

---

## Technical Implementation

### Data Structures

```javascript
// Terrain map (5x5 or 7x7 matrix)
currentMap = [
  ["empty", "mountain", "empty", ...],
  ["bridge", "empty", "oasis", ...],
  ...
]

// Placed rails (parallel matrix)
placedRails = [
  [null, "mountain_rail", null, ...],
  ["bridge_rail", null, null, ...],
  ...
]

// Rotation angles (parallel matrix)
rotationMap = [
  [0, 90, 0, ...],
  [0, 0, 180, ...],
  ...
]
```

### Validation Algorithm

The game validates puzzle completion by:
1. Checking all required terrain has rails
2. Finding a starting rail cell
3. Following the rail connections
4. Verifying each connection is valid
5. Ensuring the path forms a complete loop
6. Confirming all rails are visited

### Rail Connection System

- **Straight Rails:** Connect opposite sides (top-bottom or left-right)
- **Curve Rails:** Connect adjacent sides (90° turns)
- Rotation is handled by rotating the exit points

---

## Files Included

- `index.html` - Main HTML structure
- `script.js` - Game logic and functionality
- `styles.css` - All styling
- `README.md` - This file
- Image assets:
  - `empty.png`, `mountain.png`, `bridge.png`, `oasis.png`
  - `straight_rail.png`, `curve_rail.png`, `bridge_rail.png`, `mountain_rail.png`
  - `thumbnail.png`, `menu_screen.png`, `Titlerail.png`

---

## Browser Compatibility

Tested and working on:
- Modern Chrome/Edge
- Firefox
- Safari

---

## Known Limitations

- Canvas-based rendering (not DOM elements)
- Right-click context menu is disabled on canvas
- Requires JavaScript enabled

---

## Future Enhancements (Not Implemented)

- Undo/Redo functionality
- Hint system
- Level editor
- Save/Load progress
- Leaderboard with best times
- Sound effects
- Mobile touch support

---

## Credits

- Game concept: Railways puzzle game
- Implementation: Original work
- Assets: Provided in starter pack

---

**End of README**
