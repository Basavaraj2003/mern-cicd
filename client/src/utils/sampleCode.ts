
export const sampleCode = `// Example JavaScript code with some quality issues
function calculateTotal(items) {
  var total = 0;
  
  // Loop through items
  for (var i = 0; i < items.length; i++) {
    total += items[i].price
  }
  
  // Log for debugging
  console.log("Total calculated:", total);
  
  // Unused variables
  const taxRate = 0.1;
  
  // Return the result
  return total;
}

try {
  // Code that might throw an error
  const result = calculateTotal([]);
} catch (err) {
  // Empty catch block
}

// Security vulnerability
function processUserInput(input) {
  return eval(input);
}

// This is a very long line that exceeds the maximum line length and will trigger the linter warning about the maximum line length
`;
