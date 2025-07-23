// Caspian - Node.js Application
// Entry point for the application

console.log('Welcome to Caspian!');

// Example function
function greet(name = 'World') {
    return `Hello, ${name}!`;
}

// Main function
function main() {
    console.log(greet('Caspian'));
    console.log('Application started successfully.');
}

// Run the main function if this file is executed directly
if (require.main === module) {
    main();
}

// Export functions for use in other modules
module.exports = {
    greet,
    main
};
