const particleState = {
  max: 70,
  canvas: null,
  context: null,
  particles: [],
  colors: ['#15D1AA', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
}

class Particle {
  constructor(id = 0) {
    this.id = id
    this.type = this.randomizeType()
    this.inBounds = false
    this.coords = {
      x: Math.round(Math.random() * particleState.canvas.width),
      y: Math.round(Math.random() * particleState.canvas.height)
    }
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.7),
      y: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.7)
    }
    this.alpha = 0.1
    this.hex = this.randomFromArray(particleState.colors)
    this.color = this.hexToRGBA(this.hex, this.alpha)
    this.strokeWidth = Math.random() * (Math.random() > 0.5 ? 1.5 : 2.5)

    switch (this.type) {
      case 'bubble':
        this.diameter = this.getCircleDiameter()
        break
      case 'line':
        this.angle = Math.atan2(this.coords.y, this.coords.x)
        this.length = this.randomFromArray([5, 7, 3, 10])
        this.rotateSpeed = this.randomFromArray([10, 30, 60, 120])
        this.rotateClockwise = Math.random() < 0.5
        break
    }
  }

  getCircleDiameter() {
    let diameter = 0
    while (diameter < 2) {
      diameter = (Math.random() * 7) * 2
    }
    return diameter
  }

  update() {
    if (this.alpha < 1) {
      this.alpha += 0.01
      this.color = this.hexToRGBA(this.hex, this.alpha)
    }
    this.coords.x += this.velocity.x
    this.coords.y += this.velocity.y

    if (this.type === 'line') {
      let angle = Math.PI / this.rotateSpeed
      this.angle += this.rotateClockwise ? -Math.abs(angle) : Math.abs(angle)
    }

    return this.withinBounds()
  }

  draw() {
    particleState.context.lineWidth = this.strokeWidth
    particleState.context.strokeStyle = this.color
    particleState.context.save()

    switch (this.type) {
      case 'line':
        particleState.context.translate(this.coords.x / 2, this.coords.y / 2)
        particleState.context.rotate(this.angle)
        particleState.context.beginPath()
        particleState.context.moveTo(-this.length / 2, 0)
        particleState.context.lineTo(this.length / 2, 0)
        break
      case 'bubble':
        particleState.context.beginPath()
        particleState.context.arc(this.coords.x, this.coords.y, this.diameter, 0, Math.PI * 2, false)
        break
    }

    particleState.context.stroke()
    particleState.context.restore()
  }

  withinBounds() {
    let boundX = (particleState.canvas.width / 2) + 5
    let boundY = (particleState.canvas.height / 2) + 5
    let x = this.coords.x / 2
    let y = this.coords.y / 2

    this.inBounds = !((x > boundX || x < -5) || (y > boundY || y < -5))
    return this.inBounds
  }

  hexToRGBA(hex, alpha) {
    hex = hex.replace('#', '')
    let red = parseInt(hex.substring(0, 2), 16)
    let green = parseInt(hex.substring(2, 4), 16)
    let blue = parseInt(hex.substring(4, 6), 16)
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  randomizeType() {
    let types = Array(4).fill('bubble')
    types.push('line')
    return this.randomFromArray(types)
  }
}

const updateHeroCanvasSize = () => {
  particleState.canvas.width = window.innerWidth * 2
  particleState.canvas.height = window.innerHeight * 2
  particleState.canvas.style.width = window.innerWidth + 'px'
  particleState.canvas.style.height = window.innerHeight + 'px'
}

let pids = 0
const generateParticles = () => {
  for (let i = particleState.particles.length; i < particleState.max; i++) {
    particleState.particles.push(new Particle(pids++))
  }
}

const updateParticles = () => {
  if (particleState.particles.length < particleState.max - 5) generateParticles()

  particleState.particles = particleState.particles.filter(p => p.update())

  particleState.context.clearRect(0, 0, particleState.canvas.width, particleState.canvas.height)
  particleState.particles.forEach(p => p.draw())

  requestAnimationFrame(updateParticles)
}

const initParticles = () => {
  particleState.canvas = document.querySelector('#hero-canvas')
  if (!particleState.canvas) return
  particleState.context = particleState.canvas.getContext('2d')
  updateHeroCanvasSize()
  generateParticles()
  updateParticles()

  window.addEventListener('resize', updateHeroCanvasSize)
}

document.addEventListener('DOMContentLoaded', () => initParticles())
