
// --- Configuration ---
const BG_COLOR = '#f8d568';
const LIGHT_YELLOW = '#ffeb99';
const LINE_COLOR = '#333333';

// --- RIGHT PANEL CONFIG ---
const NUM_ICONS = 12;
const ICON_SIZE = 400;    
const GAP = 36;           
const PADDING = 40;       
const MARGIN_RIGHT = 30;  

// --- FALLING ANIMATION CONFIG (New) ---
const FALL_ICON_SIZE = 220; // 掉落盒子的大小
const FLOOR_OFFSET = 80;    // 堆叠地面距离底部的距离

// --- Matter.js Aliases (New) ---
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

// --- Sample Layout Config ---
const FIXED_POSITIONS = [
  { x: 0.15, y: 0.10 },
  { x: 0.75, y: 0.05 },
  { x: 0.45, y: 0.35 },
  { x: 0.20, y: 0.60 },
  { x: 0.70, y: 0.65 }
];

// --- Text Content Configuration ---
const TEXT_CONFIG = [
  { 
    title: "1000 cranes ", 
    description: "1000 cranes is an expression of a blessing to others. It can be an ornament or a craft to pass the time. According to the artist who created the work, it is a carrier of ‘happiness’ that brings out the memories contained in the work. It is made of ordinary origami paper, something that is commonly seen in daily life." 
  },
  { title: "Paper plane", description: "Paper plane is a toy airplane made of paper, and it is the easiest type of origami to master, so it is popular among beginners and even experts. According to the artist's recollection, the paper plane is one of the most unforgettable memories of his childhood fun. It can be made of any kind of paper, and all kinds of materials affect its trajectory when it ‘flies’." },
  { title: "Uesd tissue ball", description: "The uesd tissue ball is a neglected or even useless thing in daily life. However, it often holds a short-term memory, and the traces it carries represent the state and condition of the person who used it. For the artist who created this work, the work is about a past illness, and the ‘traces of use’ attached to the paper ball is a figurative expression of the artist's illness. It can be created with any type of paper that can be used to attach traces." },
  { title: "Paper strip", description: "Paper strip is a phenomenon that is used as a vehicle to convey a message, usually appears in adolescence. It is usually folded into various shapes to facilitate passing it back and forth. According to the artist who created this work, the strips of paper usually contain various textual messages to be conveyed as well as supporting drawings, which is a manifestation of the strong desire to express oneself as a student. In general, various types of paper strips made of various types of writing paper can be found." },
  { title: "Receipt", description: "Receipt is a text issued by the seller to the buyer in an economic activity. It is often used in everyday life as a basic document when people keep accounts. It originates from various stores that offer buying and selling functions, and its layout is varied. The type of paper used is thermal paper, a special paper on which text can be printed without the use of ink. Because of the special nature of the paper, the information on the paper is not stored for a long time, so the information on the paper will disappear slowly. It is a medium for presenting short-term information. Nowadays, with the rapid development of digitalization, it is also possible to obtain paperless mobile receipts with only digital information." },
  { title: "Banknote", description: "Banknote is a special monetary certificate printed on special paper, usually issued by the state and used compulsorily as a monetary symbol. It enables the purchase of goods of a certain value for a certain amount of face value. However, with the development of digital society, banknotes have gradually become a symbol of amount for digital payment. Since banknote is a currency made of paper, it is subject to defacement or breakage after constant circulation and use. Because of its short-term storage characteristics, now its use is classified as an emergency option when digital payments are not available." },
  { title: "Sticker", description: "A sticker is a paper marker with pictures and words printed on the front and an adhesive back, but nowadays many people use different types of stickers as decoration on objects. Because of its decorative nature, it can be used as a freehand ‘drawing board’ to create your own sticker patterns with your own ideas. Now stickers can be applied not only to real-life things but also to digital pictures on mobile platforms." },
  { title: "Red packet", description: "Red packet is a small gift made of red envelope, which is commonly used for various celebrations in the context of traditional Chinese customs and the Chinese cultural circle. Red packets are famous for their red packaging, but the red packaging will gradually lose its color over time, and it is not very ‘auspicious’ to send each other red packets that lose their color, so it is theoretically a disposable item. Due to the popularity of digital payments, people nowadays prefer to send red envelopes in the form of network transfers." },
  { title: "Blue nudes", description: "When Henri Matisse created ‘blue nudes’, he always tried to find a way and a guideline to make the colors and lines blend together. Using this as inspiration, I imitates Matisse own form of creation to create ‘new blue nudes’ based on the emotion and vitality that I feels in the original work." },
  { title: "Detail", description: "When Roman Opałka creates ‘detail’, Opałka tries to approach the infinite abyss in time through an extreme form of practice. Using this as inspiration, I take the theme presented in the original work, the experimental art that travels through time as a theoretical basis, and then imitates its creative form to create a ‘new detail’." },
  { title: "Gap", description: "Inspired by Shin Ho-oon's No Essence series, which aims to show the process of individuals choosing religion as a way to unite to overcome difficulties, the work is based on the theory of structuring various religions, including Buddha, Guan Yu, David, and Hercules, and then imitating Shin Ho-oon's creative forms to  created a ‘gap’ that incorporates my own understanding." },
  { title: "Paper tearing", description: "Taking the theme of Li Qiang's ‘Apocalypse of the Flesh’ as the theme of the exhibition, i.e., by destroying images to find the historical landscape of humanities in the torn pages of impurities as the inspiration for his works. I obtained the theoretical basis from the abstract landscape full of texture traces that Li Qiang wanted to present in the original work, and then imitated his creative form to produce the ‘paper tearing’ with his own understanding." }
];

// --- Variables ---
let boxImages = [];   
let contentData = []; 

// State
let currentIdx = -1; // -1 means NO box is selected (Closed state)
let samplesUnlocked = false;
let collectionUnlocked = false;
let lightboxMode = false;

// Physics Variables (New)
let physicsEngine;
let physicsWorld;
let fallingBoxes = []; // Stores {body, imgIndex, w, h, isDragging, currentScale}
let ground;
let leftWall, rightWall;
let nextDropTime = 0;
let dropCounter = 0;
let activeFallingBox = null; // Track currently dragged falling box

// Content Objects
let samples = []; 
let collectionItems = null; 

// UI Trackers
let tab1Y = 0;
let tab2Y = 0;
let mainImgRect = {x:0, y:0, w:0, h:0};

// Left Panel Scrolling
let leftY = 0;
let targetLeftY = 0;
let maxLeftY = 0;

// Right Panel Scrolling (Independent)
let scrollYPos = 0;
let targetScrollY = 0;
let minScroll = 0;
let maxScroll = 0;

// Interaction
let hoverIndex = -1;
let lastWheelTime = 0;
const CLICK_GUARD_MS = 150;

// Cursor
let cX = 0, cY = 0; 

// Fonts
let fontHeader; 
let fontBody;   

// --- Preload ---
function preload() {
  // Fonts
  fontHeader = loadFont('assets/DIN Condensed Bold.ttf'); 
  fontBody = loadFont('assets/DINNextLTPro-Italic.otf');

  // Images
  for (let i = 1; i <= 12; i++) {
    // Icons
    let imgOpen = loadImage('assets/open_' + i + '.png');
    let imgClose = loadImage('assets/close_' + i + '.png');
    boxImages.push({ open: imgOpen, closed: imgClose });

    // Left Panel Content
    let imgView = loadImage('assets/onview_' + i + '.png');
    
    // Samples
    let sampleImgs = [];
    for (let j = 1; j <= 5; j++) {
      sampleImgs.push({
        img: loadImage('assets/sample_' + i + j + '.png'),
        url: `www.web${j}.com/sample-${i}`
      });
    }

    // Collection
    let colMain = loadImage('assets/af_' + i + '.jpg');
    let colGif = loadImage('assets/gif_' + i + '.gif');

    contentData.push({ 
      onView: imgView, 
      samples: sampleImgs,
      collectionMain: colMain,
      collectionGif: colGif
    });
  }
}

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  noCursor();
  textFont(fontBody);
  
  calcRightBounds();
  
  // Initialize Physics (New)
  initPhysics();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcRightBounds();
  // Reset physics boundaries on resize (New)
  resetPhysics();
}

function calcRightBounds() {
  const contentH = PADDING * 2 + NUM_ICONS * ICON_SIZE + (NUM_ICONS - 1) * GAP;
  minScroll = 0;
  maxScroll = max(0, contentH - height);
  targetScrollY = constrain(targetScrollY, minScroll, maxScroll);
  scrollYPos = constrain(scrollYPos, minScroll, maxScroll);
}

// --- Physics Functions (New) ---
function initPhysics() {
  physicsEngine = Engine.create();
  physicsWorld = physicsEngine.world;
  
  createBoundaries();
  
  // Reset Falling State
  fallingBoxes = [];
  dropCounter = 0;
  nextDropTime = millis() + 500; // Start dropping after 0.5s
  activeFallingBox = null;
}

function createBoundaries() {
  // Ground (Invisible)
  let groundY = height - FLOOR_OFFSET + 50; // +50 because thickness is 100
  ground = Bodies.rectangle(width/2, groundY, width, 100, { isStatic: true });
  
  // Walls to keep boxes in view (Left wall offscreen, Right wall near the box list)
  let rightBoundaryX = width - MARGIN_RIGHT - ICON_SIZE - 50; 
  leftWall = Bodies.rectangle(-100, height/2, 200, height * 2, { isStatic: true });
  rightWall = Bodies.rectangle(rightBoundaryX + 100, height/2, 200, height * 2, { isStatic: true });
  
  World.add(physicsWorld, [ground, leftWall, rightWall]);
}

function resetPhysics() {
  World.clear(physicsWorld);
  Engine.clear(physicsEngine);
  initPhysics();
}

function spawnNextBox() {
  if (dropCounter >= NUM_ICONS) return;
  
  let idx = dropCounter; // Use boxes in order 0-11
  let img = boxImages[idx].closed;
  
  // Calculate Size
  let w = FALL_ICON_SIZE;
  let h = FALL_ICON_SIZE;
  if (img.width > 1) h = w * (img.height / img.width);
  
  // Randomize drop X slightly (left side of screen)
  let dropAreaW = width - (MARGIN_RIGHT + ICON_SIZE + 200);
  let startX = random(dropAreaW * 0.2, dropAreaW * 0.8);
  
  // *** PHYSICS ADJUSTMENT FOR TIGHTER STACKING ***
  // Reduced hitbox scale to 0.45 to allow significant overlapping
  let hitboxScale = 0.45; 

  let body = Bodies.rectangle(startX, -200, w * hitboxScale, h * hitboxScale, {
    restitution: 0.1, // Low restitution for less bouncing
    friction: 0.8,    // High friction for stable stacking
    angle: random(-PI/4, PI/4)
  });
  
  fallingBoxes.push({
    body: body,
    imgIndex: idx,
    w: w, // Keep visual width
    h: h, // Keep visual height
    isDragging: false,
    currentScale: 1.0
  });
  
  World.add(physicsWorld, body);
  
  dropCounter++;
  nextDropTime = millis() + 300; // Drop next one every 300ms
}

// --- Draw Loop ---
function draw() {
  background(BG_COLOR);

  // Smooth Cursor
  cX = lerp(cX, mouseX, 0.2);
  cY = lerp(cY, mouseY, 0.2);

  // === STATE 1: CLOSED (Physics Animation - New) ===
  if (currentIdx === -1) {
    // 1. Update Physics
    Engine.update(physicsEngine);
    
    // 2. Spawn new boxes over time
    if (millis() > nextDropTime) {
      spawnNextBox();
    }
    
    // 3. Update & Draw Falling Boxes
    for (let box of fallingBoxes) {
      
      // DRAG LOGIC: Manually set position if dragging
      if (box.isDragging) {
        Matter.Body.setPosition(box.body, { x: mouseX, y: mouseY });
        // Reset velocity so it doesn't fly away when released
        Matter.Body.setVelocity(box.body, { x: 0, y: 0 });
        // Keep it upright-ish or rotating naturally? Let's just hold pos
      }
      
      let pos = box.body.position;
      let angle = box.body.angle;
      let img = boxImages[box.imgIndex].closed;
      
      // ANIMATED SCALE LOGIC
      let targetScale = box.isDragging ? 1.5 : 1.0;
      box.currentScale = lerp(box.currentScale, targetScale, 0.2);
      
      push();
      translate(pos.x, pos.y);
      scale(box.currentScale); // Apply scale
      rotate(angle);
      imageMode(CENTER);
      
      // Stronger shadow when dragging
      if (box.isDragging) {
         drawingContext.shadowBlur = 40;
         drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
      } else {
         drawingContext.shadowBlur = 20;
         drawingContext.shadowColor = 'rgba(0,0,0,0.15)';
      }
      
      // Draw image using full visual size (larger than hitbox)
      image(img, 0, 0, box.w, box.h);
      pop();
    }
  }

  // === STATE 2: OPEN (Content) ===
  if (currentIdx !== -1 && !lightboxMode) {
    drawLeftPanel();
  }

  // 3. Draw Lightbox
  if (lightboxMode) {
    drawLightbox();
  }

  // 4. Draw Right Panel (Box List)
  if (!lightboxMode) {
    drawRightPanel();
  }
  
  // 5. Custom Cursor
  drawCustomCursor();
}

// --- Right Panel Logic ---
function drawRightPanel() {
  // Update Scroll
  const easing = 0.18;
  scrollYPos = lerp(scrollYPos, targetScrollY, easing);
  
  hoverIndex = -1;

  // X Position: Align to right side based on margin and icon size
  const baseX = width - MARGIN_RIGHT - ICON_SIZE / 2;
  
  for (let i = 0; i < NUM_ICONS; i++) {
    const y = PADDING + i * (ICON_SIZE + GAP);
    const top = y - scrollYPos;

    // Visibility Check
    if (top + ICON_SIZE < -100 || top > height + 100) continue;

    // Hover Check
    // We check against the actual drawn position
    const isHover = (mouseX > baseX - ICON_SIZE/2 && mouseX < baseX + ICON_SIZE/2 &&
                     mouseY > top && mouseY < top + ICON_SIZE);

    if (isHover) hoverIndex = i;

    push();
    translate(baseX, top + ICON_SIZE / 2); // Center of icon
    imageMode(CENTER);

    // Scaling Effect
    if (isHover) {
      scale(1.05);
    }
    
    // Shadow
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(0,0,0,0.15)';

    // Choose Image: Open if it matches currentIdx, else Closed
    let img = (currentIdx === i) ? boxImages[i].open : boxImages[i].closed;
    
    // Aspect Ratio safe draw
    let drawW = ICON_SIZE;
    let drawH = ICON_SIZE;
    if (img.width > 1) {
       // Fit within the square box
       let ratio = img.height / img.width;
       if (ratio > 1) {
         drawH = ICON_SIZE;
         drawW = ICON_SIZE / ratio;
       } else {
         drawW = ICON_SIZE;
         drawH = ICON_SIZE * ratio;
       }
    }

    image(img, 0, 0, drawW, drawH);
    pop();
  }
}

// --- Left Panel Logic ---
function drawLeftPanel() {
  // Calculate available width for left panel
  // Total width - Right Panel Space (Icon + Margins + extra buffer)
  let rightPanelSpace = MARGIN_RIGHT + ICON_SIZE + 50;
  let w = width - rightPanelSpace;
  
  // Ensure we have some minimum width, or just clamp it
  if (w < 300) w = 300; 

  // Smooth scroll
  leftY = lerp(leftY, targetLeftY, 0.1);
  
  push();
  translate(0, -leftY);

  let cursorY = 100; 

  // 1. Title
  fill('#1a1a1a');
  textFont(fontHeader); 
  textSize(90);
  textStyle(BOLD);
  let titleText = TEXT_CONFIG[currentIdx].title;
  text(titleText, 50, cursorY);
  
  cursorY += 100;

  // 2. Main Image
  let data = contentData[currentIdx];
  let img = data.onView;
  
  // Width logic: 80% of the available left panel width, then scaled 80% again for 'preview'
  let imgW = (w * 0.8) * 0.8; 
  let imgH = imgW * (3/4); 

  if (img.width > 1) imgH = imgW * (img.height / img.width);
  
  let screenImgY = cursorY - leftY;
  let isHoverImg = (mouseX > 50 && mouseX < 50 + imgW && mouseY > screenImgY && mouseY < screenImgY + imgH);
  
  mainImgRect = {x: 50, y: cursorY, w: imgW, h: imgH};

  push();
  if (isHoverImg) {
    noTint();
    drawingContext.filter = 'none';
  } else {
    tint(180);
    drawingContext.filter = 'blur(5px)'; 
  }
  
  stroke(255); strokeWeight(5);
  rect(50, cursorY, imgW, imgH);
  noStroke();
  
  image(img, 50, cursorY, imgW, imgH);
  drawingContext.filter = 'none';
  
  if (isHoverImg) {
    fill(0, 180);
    rect(50 + imgW/2 - 60, cursorY + imgH/2 - 20, 120, 40, 20);
    fill(255);
    textFont(fontBody); textSize(14); textAlign(CENTER, CENTER);
    text("Click to Expand", 50 + imgW/2, cursorY + imgH/2);
  }
  pop();

  cursorY += imgH + 60;

  // 3. Line
  stroke(LINE_COLOR); strokeWeight(1);
  line(50, cursorY, w - 50, cursorY);
  cursorY += 50;

  // 4. Description
  noStroke();
  fill(30);
  textFont(fontBody); 
  textSize(20);
  textLeading(32);

  let txt = TEXT_CONFIG[currentIdx].description;
  // Expanded width (Green Box Area: Width of panel minus margins)
  text(txt, 50, cursorY, w - 100); 
  
  // Recalculate estimated height with wider text box (approx 90 chars/line)
  let lines = (txt.length / 90) + 2; 
  // Reduced spacing (Red Box Area: reduced from +100 to +30)
  cursorY += lines * 35 + 30;

  // 5. Tab 1: Samples
  tab1Y = cursorY; 
  drawTab(cursorY, w, "Samples", samplesUnlocked);
  
  if (samplesUnlocked) {
    cursorY += 100;
    let samplesAreaHeight = 1000;

    for (let s of samples) {
      // We pass 'w' (panel width) to update function for boundary calculation
      s.update(cursorY, leftY, samplesAreaHeight, w);
      s.display(cursorY);
    }
    cursorY += samplesAreaHeight; 
  } else {
    cursorY += 80; 
  }

  cursorY += 25; 
  
  // 6. Tab 2: The Collection
  tab2Y = cursorY; 
  drawTab(cursorY, w, "The Collection", collectionUnlocked);

  if (collectionUnlocked) {
    cursorY += 100;
    drawCollectionLayout(cursorY, w);
    cursorY += 500; 
  } else {
    cursorY += 80;
  }

  // Unify Bottom Padding (Blue Box Area) with Top Padding (100)
  let totalH = cursorY + 100;
  maxLeftY = max(0, totalH - height);

  pop();
}

// --- Helpers ---

function drawTab(y, w, title, isOpen) {
  let tabW = 600; 
  let tabH = 80;

  let ctx = drawingContext;
  let grd = ctx.createLinearGradient(0, y - tabH, 0, y);
  grd.addColorStop(0, LIGHT_YELLOW); 
  grd.addColorStop(1, BG_COLOR);     
  
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(0, y - tabH);
  ctx.lineTo(tabW - 50, y - tabH);
  ctx.bezierCurveTo(tabW, y - tabH, tabW, y, tabW + 50, y);
  ctx.lineTo(w, y);
  ctx.closePath();
  ctx.fill();

  fill(0);
  noStroke();
  textFont(fontHeader); 
  textSize(28);
  textAlign(LEFT, BASELINE);
  
  let label = isOpen ? title : `Click to Unlock ${title}`;
  text(label, 40, y - 25);
}

function drawCollectionLayout(startY, panelW) {
  let items = collectionItems;
  if (!items) return;

  let areaW = panelW - 100; 
  let mainSize = areaW * 0.6; 
  let gap = 40;
  
  // Left: 1:1 Square
  push();
  translate(50, startY);
  rotate(radians(1)); 
  
  fill(0, 20); noStroke();
  rect(10, 10, mainSize, mainSize);
  
  if (items.main) {
     image(items.main, 0, 0, mainSize, mainSize);
  }
  pop();

  // Right: GIF/Image
  let rightW = areaW - mainSize - gap;
  let rightH = rightW * (9/16); 

  if (items.gif && items.gif.width > 0) {
    let aspectRatio = items.gif.height / items.gif.width;
    if (aspectRatio > 1.2) {
      rightW = rightW * 0.55; 
    }
    rightH = rightW * aspectRatio;
  }
  
  push();
  translate(50 + mainSize + gap, startY + mainSize - rightH); 
  rotate(radians(-2));
  
  fill(0, 20); noStroke();
  rect(10, 10, rightW, rightH);
  
  if (items.gif) {
    image(items.gif, 0, 0, rightW, rightH);
  }
  pop();
}

function drawLightbox() {
  fill(0, 0, 0, 250); 
  noStroke();
  rect(0, 0, width, height);

  let img = contentData[currentIdx].onView;
  let scaleFactor = min((width * 0.95) / img.width, (height * 0.95) / img.height);
  let w = img.width * scaleFactor;
  let h = img.height * scaleFactor;
  
  let ix = width/2;
  let iy = height/2;
  
  imageMode(CENTER);
  noTint();
  drawingContext.filter = 'none'; 
  
  image(img, ix, iy, w, h);
  imageMode(CORNER);

  let btnX = 40, btnY = 40;
  stroke(255); strokeWeight(3);
  line(btnX, btnY, btnX + 20, btnY + 20);
  line(btnX, btnY + 20, btnX + 20, btnY);
  
  noStroke();
  fill(255);
  textFont(fontHeader); textSize(16);
  textAlign(LEFT, TOP);
  text("CLOSE", btnX + 30, btnY);
}

function drawCustomCursor() {
  push();
  drawingContext.globalCompositeOperation = 'difference';
  fill(255); noStroke();
  circle(cX, cY, 20);
  pop();
}

// --- Sample Class ---
class Sample {
  constructor(xRatio, yRatio, imgObj) {
    this.xRatio = xRatio;
    this.yRatio = yRatio;
    this.img = imgObj.img;
    this.url = imgObj.url;
    this.size = 360; // Doubled size
    this.angle = random(-0.1, 0.1);
    this.x = 0; 
    this.y = 0;
    this.screenX = 0;
    this.screenY = 0;
    this.dragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.showTooltip = false;
    this.tooltipText = this.url;
    
    // 1. New: Scale tracker for animation
    this.currentScale = 1.0;
  }
  
  update(containerY, currentScrollY, areaHeight, panelW) {
    if (this.x === 0 && this.y === 0) {
      this.x = this.xRatio * panelW;
      this.y = this.yRatio * areaHeight; 
    }

    this.screenX = this.x;
    this.screenY = (containerY - currentScrollY) + this.y;

    if (this.dragging) {
      let newScreenX = mouseX + this.dragOffsetX;
      let newScreenY = mouseY + this.dragOffsetY;
      
      this.x = newScreenX;
      this.y = newScreenY - (containerY - currentScrollY);
      
      // --- Constraints ---
      let halfW = this.size / 2;
      let imgH = this.size;
      if (this.img && this.img.width > 0) {
        imgH = this.size * (this.img.height / this.img.width);
      }
      let halfH = imgH / 2;
      
      // Boundaries
      let minX = 40 + halfW;
      let maxX = panelW - halfW;
      let minY = halfH;
      let maxY = areaHeight - halfH;
      
      this.x = constrain(this.x, minX, maxX);
      this.y = constrain(this.y, minY, maxY);
      
      this.screenX = this.x;
      this.screenY = (containerY - currentScrollY) + this.y;
    } 
    
    let d = dist(mouseX, mouseY, this.screenX, this.screenY);
    this.showTooltip = (d < this.size/2 && !this.dragging && !lightboxMode);
  }
  
  display(containerY) {
    // 2. New: Animated Scaling logic
    // Target is 2.0 if dragging, 1.0 if released
    let targetScale = this.dragging ? 2.0 : 1.0;
    // Smooth transition (0.2 is the speed)
    this.currentScale = lerp(this.currentScale, targetScale, 0.2);

    push();
    translate(this.x, containerY + this.y);
    
    // 3. New: Apply scale
    scale(this.currentScale);
    
    rotate(this.angle);
    imageMode(CENTER);
    
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(0,0,0,0.15)';
    
    if (this.img) {
      let r = this.img.height / this.img.width;
      image(this.img, 0, 0, this.size, this.size * r);
    } else {
        fill(255); rect(0,0,100,100);
    }
    pop();
    
    if (this.showTooltip) {
      push();
      translate(this.x, containerY + this.y - this.size/2 - 20);
      fill(0); noStroke();
      rectMode(CENTER);
      rect(0, 0, textWidth(this.tooltipText) + 20, 30, 4);
      fill(255); textAlign(CENTER, CENTER);
      textSize(12); textFont(fontBody);
      text(this.tooltipText, 0, 0);
      pop();
    }
  }
  
  checkClick() {
    let d = dist(mouseX, mouseY, this.screenX, this.screenY);
    if (d < this.size / 2) {
      this.dragging = true;
      this.dragOffsetX = this.screenX - mouseX;
      this.dragOffsetY = this.screenY - mouseY; 
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.url);
        this.tooltipText = "Copied!";
        setTimeout(() => { this.tooltipText = this.url; }, 2000);
      }
      return true;
    }
    return false;
  }
  
  stopDrag() {
    this.dragging = false;
  }
}

// --- Interaction Events ---

function mousePressed() {
  if (lightboxMode) {
    lightboxMode = false;
    return;
  }

  // 1. Check Falling Boxes Dragging (Priority if closed)
  if (currentIdx === -1) {
    // Reverse check for z-order (top first)
    for (let i = fallingBoxes.length - 1; i >= 0; i--) {
      let box = fallingBoxes[i];
      let pos = box.body.position;
      // Simple circular check for clicking, assuming size approx box.w
      if (dist(mouseX, mouseY, pos.x, pos.y) < box.w / 2) {
        box.isDragging = true;
        activeFallingBox = box;
        
        // Move to end of array to draw on top
        fallingBoxes.splice(i, 1);
        fallingBoxes.push(box);
        return;
      }
    }
  }

  // 2. Check Right Panel (Icons)
  let rightHit = hitIndex(mouseX, mouseY);
  if (rightHit !== -1) {
    toggleBox(rightHit);
    return;
  }

  // If no box is selected, we can't interact with left panel content
  if (currentIdx === -1) return;

  // 3. Check Samples Dragging
  if (samplesUnlocked) {
    for (let i = samples.length - 1; i >= 0; i--) {
      if (samples[i].checkClick()) {
        let clickedSample = samples.splice(i, 1)[0];
        samples.push(clickedSample);
        return;
      }
    }
  }

  let clickY = mouseY + leftY; 

  // 4. Check Left Panel UI
  if (clickY > mainImgRect.y && clickY < mainImgRect.y + mainImgRect.h && 
      mouseX > mainImgRect.x && mouseX < mainImgRect.x + mainImgRect.w) {
    lightboxMode = true;
    return;
  }

  if (clickY > tab1Y - 80 && clickY < tab1Y) {
    samplesUnlocked = !samplesUnlocked;
    return;
  }

  if (clickY > tab2Y - 80 && clickY < tab2Y) {
    collectionUnlocked = !collectionUnlocked;
    return;
  }
}

function mouseReleased() {
  // Release falling boxes
  if (activeFallingBox) {
    activeFallingBox.isDragging = false;
    activeFallingBox = null;
  }

  // Release samples
  for (let s of samples) {
    s.stopDrag();
  }
}

function mouseWheel(e) {
  if (lightboxMode) return false;

  // Check which side we are scrolling
  let rightZoneStart = width - MARGIN_RIGHT - ICON_SIZE - 20;

  if (mouseX > rightZoneStart) {
    // Scroll Right Panel
    targetScrollY += e.deltaY;
    targetScrollY = constrain(targetScrollY, minScroll, maxScroll);
    lastWheelTime = millis();
  } else {
    // Scroll Left Panel (only if content exists)
    if (currentIdx !== -1) {
      targetLeftY += e.deltaY;
      targetLeftY = constrain(targetLeftY, 0, maxLeftY);
    }
  }
  return false;
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    lightboxMode = false;
  }
}

// --- Logic Helpers ---

function hitIndex(mx, my) {
  const baseX = width - MARGIN_RIGHT - ICON_SIZE / 2;
  const left = baseX - ICON_SIZE / 2;
  const right = baseX + ICON_SIZE / 2;
  
  if (mx < left || mx > right) return -1;

  const contentY = my + scrollYPos - PADDING;
  const stride = ICON_SIZE + GAP;
  
  if (contentY < 0) return -1;

  const idx = floor(contentY / stride);
  if (idx < 0 || idx >= NUM_ICONS) return -1;

  const offset = contentY - idx * stride;
  // Use a slight buffer for gap detection, but mostly check box
  return offset <= ICON_SIZE ? idx : -1;
}

function toggleBox(index) {
  if (currentIdx === index) {
    // Clicked same box -> Close it and Reset Physics (New)
    currentIdx = -1;
    resetPhysics();
  } else {
    // Clicked different box -> Open it
    changeContent(index);
  }
}

function changeContent(index) {
  currentIdx = index;
  let data = contentData[index];
  
  // Reset Scroll & States
  targetLeftY = 0;
  leftY = 0;
  samplesUnlocked = false;
  collectionUnlocked = false;

  // Init Samples
  samples = [];
  // Need to know current left panel width for precise positioning
  let rightPanelSpace = MARGIN_RIGHT + ICON_SIZE + 50;
  let panelW = width - rightPanelSpace;
  
  for (let i = 0; i < 5; i++) {
    let pos = FIXED_POSITIONS[i];
    let sData = data.samples[i];
    let s = new Sample(pos.x, pos.y, sData);
    // Initialize x/y immediately
    s.x = pos.x * panelW;
    // Area height is 1000, so pre-calc y
    s.y = pos.y * 1000;
    samples.push(s);
  }
  
  // Init Collection
  collectionItems = {
    main: data.collectionMain,
    gif: data.collectionGif
  };
}
