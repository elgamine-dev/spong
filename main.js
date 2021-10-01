import './style.css'

import kaboom from 'kaboom'
// initialize kaboom context

const k = kaboom({
  width: 1200,
  height: 500,
  root: document.getElementById('app'),
});

const config = {
    froggySpeed: 200
}

const initialValues = {
    touches: 0,
    wave: 1,
    lives: 3,
    locked: false,
    dropzoneSize: 0,
    padSize: 190,
    ballSpeed: 400,
}

let store;

const center = () => pos(width() / 2 - 5, height() / 2 - 5)

loadSprite("pad", './assets/pad.png')
loadSprite("ball", './assets/ball.png')


k.scene('welcome', () => {
    add([
        rect(width(), height()),
        pos(0,0),
        color(0,0,0),
    ])
    add([
        text('spong', {size:50, font: "sink"}),
        origin('center'),
        pos(width() / 2, height() / 2)
    ])

    add([
        text('press space', {size:20, font: "sink"}),
        origin('center'),
        pos(width() / 2, height() / 2 + height() * 0.2)
    ])


    keyDown('space', () => {
        k.go('game')
    })
})

k.scene('game', () => {
    store = createStore()

  layers([
      'background',
      'ui',
      'game',
  ], "game")

  // add a game obj to screen, from a list of components
  const froggy = add([
      
      pos(20, 180),
      rect(15, store.padSize),
      area(),
      solid(),
      outline(1),
      health(3),
      layer('game'),
      color(255,255,255),
      "pad",
  ]);


  const ball = add([
      pos(300,300),
      solid(),
      area(), 
      center(),
      origin("center"),
      layer('game'),
      z(200),
      sprite('ball'),
      "ball", 
      {
        dir: vec2(1,-0.6),
        speed: 400,
      }
  ])

  // add a platform
  add([
      pos(0, 497),
      rect(width(), 3),
      solid(),
      area(),
      color(120, 120, 120),
      "wall"
  ])

  add([
      pos(0, 0),
      rect(width(), 3),
      solid(),
      area(),
      color(120, 120, 120),
      "wall"
  ])


  add([
      pos(1197, 0),
      rect(3, height()),
      solid(),
      area(),
      color(120, 120, 120),
      "backwall"
  ])

  add([
      pos(0, 0),
      rect(10, height()),
      solid(),
      area(),
      color(0, 0, 0),
      "hell"
  ])
  add([
      pos(598, 0),
      rect(4, height()),
      color(30, 30, 30),
      layer('background'),
      z(-1)
  ])
  add([
      rect(width(), height()),
      color(0, 0, 0),
      layer('background'),
      z(-100),
  ])

  const dropzone = add([
      rect(store.dropzoneSize, height()),
      pos(0, 0),
      color(100,0,0),
      z(-99),
      layer('background'),
      "dropzone",
  ])


   const updateUI = ui()
/**
 * inputs
 */

  
  keyDown("a", () => {
      if (!store.locked) {
          froggy.move(0, -config.froggySpeed);
      }

  });

  keyDown("q", () => {
    if (!store.locked) {
      froggy.move(0, config.froggySpeed);
    }
  });

  /**
   * actions
   */

  action('ball', (ball)=>{
      ball.move(ball.dir.scale(store.ballSpeed))  
      
      if (ball.pos.x < store.dropzoneSize && ball.dir.x < 0) {
        store.locked = true
        froggy.use(color(0, 0, 255))
      } else {
        store.locked = false
        froggy.use(color(255, 255, 255))
      }
  })

  /**
   * collisions
   */

  collides('ball', "pad", (b, p, s) => {
      ball.dir = vec2(-1 * ball.dir.x, ball.dir.y + ((Math.random() - 0.5 ) / 10) )
      store.touches++
      froggy.use(outline(1))
      
      setTimeout(() => {
        froggy.use(outline(0))

      },100)
  })


collides('ball', "backwall", (b, p, s) => {
    ball.dir = vec2(-1 * ball.dir.x, ball.dir.y + ((Math.random() - 0.5 ) / 10) )
    ball.speed = ball.speed + 5
})

  collides('ball', "wall", () => {
    ball.dir = vec2(ball.dir.x, -1 * ball.dir.y)
  })

  collides('ball', "obstacle", (b, o, side) => {
    ball.dir = vec2(ball.dir.x, -1 * ball.dir.y)
  })

  collides('ball', "hell", () => {
      shake(10)
      froggy.hurt(1)
      ball.moveTo(width() / 2 - 5, height() / 2 - 5)
      store.lives = froggy.hp()
      store.dropzoneSize = 0

  })

  /**
   * events
   */

  froggy.on("death", ()=> {
      destroy(froggy)
      destroy(ball)

      add([
          text('GAME OVER', {size:150, font: "sink"}),
          color(200,20,20),
          origin('center'),
          pos(width() / 2, height() / 2),
      ])

      setTimeout(() => {
          k.go('welcome')
      }, 2000)
  })

  watch('dropzoneSize', value => {
    dropzone.use(rect(value, height()))
  })

  watch('touches', value => {
    store.dropzoneSize += 100
  })

  watch('wave', value => {
      store.padSize -= 15
      froggy.use(rect(15, store.padSize))
      store.ballSpeed += 25
      updateUI('waves', value)
  })

  watch('lives', value => {
    updateUI('lives', value)
  })

  watch('ballSpeed', value => {
    updateUI('speed', value)
  })
})



k.go('welcome')
// move input focus to the game
focus();




const watchers = []
function watch(key, cb) {
    watchers.push({key, cb})
}

function called(key, value) {
    watchers.filter(w => w.key === key).map(w => w.cb(value))
}

let modifiers = {
    dropzoneSize: (v) => {
        if (v > width() / 2) {
            store.wave++
            return 0
        }
    
        
        return Math.min(width() / 2, v)
    }
}

function modifier(key, value) {
    if (typeof modifiers[key] === 'function') {
        return modifiers[key](value);
    }
    return value;
}



function ui() {
    add([
        text("balls", {size:15, font: "sink"}),
        pos(width() / 2 - 50, 20),
        origin('center'),
        color(120, 120, 120),
        layer('ui'),
    ])
    add([
        text("wave", {size:15, font: "sink"}),
        pos(width() / 2 + 50, 20),
        origin('center'),
        color(120, 120, 120),
        layer('ui'),
    ])
    const els = {
        lives: add([
            text(store.lives, {size:50, font: "sink"}),
            pos(width() / 2 - 50, 60),
            origin('center'),
            color(120, 120, 120),
            layer('ui'),
        ]),
        waves: add([
            text(store.wave, {size:50, font: "sink"}),
            pos(width() / 2 + 50, 60),
            origin('center'),
            color(120, 120, 120),
            layer('ui'),
        ]),
        speed: add([
            text(store.ballSpeed, {size:20, font: "sink"}),
            pos(570, height() - 20),
            origin('center'),
            layer('ui'),
            color(120, 120, 120),
        ])
    }

    return function update(key, value) {
        els[key].text = value
    }
}

function createStore() {
    return new Proxy({...initialValues}, {
        set: function(target, key, value) {
            const modified = modifier(key, value)
            called(key, modified)
            target[key] = modified
            return true
        }
    })
}