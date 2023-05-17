// Create the button
const button = document.createElement("button");
button.textContent = "Submit File";
button.style.backgroundColor = "#00FF7F";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Create the progress element
const progress = document.createElement('progress');
progress.style.width = '99%';
progress.style.height = '5px';
progress.style.backgroundColor = 'grey';

// Create the progress bar
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append the progress bar to the progress element
progress.appendChild(progressBar);

// Find the element to insert the button and progress element before
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');

// Insert the button and progress element into the DOM
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// File submission functionality
button.addEventListener('click', async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    const filename = file.name;
    const reader = new FileReader();

    reader.onload = async () => {
      const fileContent = reader.result;
      const chunkSize = 15000;
      const numChunks = Math.ceil(fileContent.length / chunkSize);

      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = fileContent.substring(start, end);

        await submitConversation(chunk, i + 1, filename);

        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = 'blue';
    };

    reader.readAsText(file);
  });

  fileInput.click();
});

// Function to submit a conversation chunk
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector('textarea[tabindex="0"]');
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}