document.getElementById('search-input')?.addEventListener('keyup', async (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    const keyword = inputElement.value.trim(); // Get the current input value
  
    // If the input is empty, clear results and return early
    if (!keyword) {
      const $results = document.getElementById('results');
      if ($results) {
        $results.innerHTML = '';
      }
      return;
    }
  
    try {
      // Send a request to the backend API with the current keyword
      console.log("got here.")
      const API_URL = `https://jsonplaceholder.typicode.com/comments?postId=3/?name=${encodeURIComponent(keyword)}`;
      const response = await fetch(API_URL);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      const comments: { name: string }[] = await response.json();
  
      // Generate HTML for the filtered comments
      const resultHtml = comments.map(comment => `<li>${comment.name}</li>`).join('');
  
      // Update the results section in the UI
      const $results = document.getElementById('results');
      if ($results) {
        $results.innerHTML = resultHtml;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
  
      // Show an error message in the results section
      const $results = document.getElementById('results');
      if ($results) {
        $results.innerHTML = `<li class="error">An error occurred. Please try again later.</li>`;
      }
    }
  });
  