import "/src/style.css"
import colors from "tailwindcss/colors"

// setup
////////////////////////////////////////////////////////////////////////////////
const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!

// utils
////////////////////////////////////////////////////////////////////////////////
function random(min = 0, max = 0) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))
}

function collision(pointA, pointB) {
  return pointA.x === pointB.x && pointA.y === pointB.y
}

// state
////////////////////////////////////////////////////////////////////////////////
let paused = true
const head = {x: 4, y: 1}
let tail = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}]
let velocity = {x: 1, y: 0}
let fruit = {x: 8, y: 1}
const edge = canvas.width - 1

// input
////////////////////////////////////////////////////////////////////////////////
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === " ") paused = !paused
  if (velocity.y) {
    if (e.key === "ArrowRight") velocity = {x: 1, y: 0}
    if (e.key === "ArrowLeft") velocity = {x: -1, y: 0}
  }
  if (velocity.x) {
    if (e.key === "ArrowDown") velocity = {x: 0, y: 1}
    if (e.key === "ArrowUp") velocity = {x: 0, y: -1}
  }
})

// update
////////////////////////////////////////////////////////////////////////////////
function update() {
  if (paused) return

  const ateFruit = collision(head, fruit)
  if (ateFruit) {
    while (collision(head, fruit) || tail.some((t) => collision(t, fruit))) {
      fruit.x = random(0, edge)
      fruit.y = random(0, edge)
    }
  }

  tail = [...tail.slice(ateFruit ? 0 : 1), {...head}]

  head.x += velocity.x
  if (head.x < 0) head.x = edge
  if (head.x > edge) head.x = 0

  head.y += velocity.y
  if (head.y < 0) head.y = edge
  if (head.y > edge) head.y = 0

  if (tail.some((t) => collision(t, head))) {
    paused = true
    alert("GAME OVER")
    location.reload()
  }
}
setInterval(update, 200)

// render
////////////////////////////////////////////////////////////////////////////////
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = colors.red["400"]
  ctx.fillRect(fruit.x, fruit.y, 1, 1)

  ctx.fillStyle = colors.emerald["600"]
  ctx.fillRect(head.x, head.y, 1, 1)

  ctx.fillStyle = colors.emerald["700"]
  tail.forEach((t) => ctx.fillRect(t.x, t.y, 1, 1))

  requestAnimationFrame(render)
}
render()
