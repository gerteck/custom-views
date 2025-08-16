// Main CustomViews class
export default class CustomViews {
  constructor(options = {}) {
    this.options = options;
  }

  hello() {
    console.log("hello")
  }
}

// Utility functions here


// Export for different module systems
export { CustomViews };