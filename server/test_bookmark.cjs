const fs = require('fs');
(async () => {
  try {
    const logFile = fs.readFileSync('C:/Users/patel/.gemini/antigravity/brain/8943b69c-43ee-4da9-a740-ea5c54f4ed7a/.system_generated/tasks/task-909.log', 'utf8');
    const token = logFile.match(/token\":\"(.*?)\"/)[1];
    
    const res = await fetch('http://localhost:5000/api/problems/1/bookmark', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
  } catch(e) {
    console.error(e);
  }
})();
