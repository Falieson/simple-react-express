module.exports = class Counter {
  constructor({
    name,
    value = 0,
    updatedAt=new Date()
  }) {
    this.name = name
    this.value = value
    this.updatedAt = updatedAt
  }
}