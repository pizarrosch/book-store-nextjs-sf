// Script to call the /api/populate-books endpoint to populate the database

async function populateBooks() {
  try {
    console.log('Calling /api/populate-books endpoint to populate the database...');
    
    const response = await fetch('http://localhost:3000/api/populate-books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Database populated successfully:', data);
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

// Run the function
populateBooks();