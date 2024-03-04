// Function to get the URL of the current tab
function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            const url = tabs[0].url;
            resolve(url);
        });
    });
}

// Function to set the URL in the textarea
async function setUrlInTextarea() {
    const url = await getCurrentTabUrl();
    document.getElementById('d_url').value = url;
}

// Call the function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    setUrlInTextarea();
});


async function shortenUrl(longUrl) {
    const apiUrl = 'https://1f5d-103-16-69-133.ngrok-free.app/url'; // Replace with your own backend API URL


    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: longUrl
            })
        });

        if (!response.ok) {
            throw new Error('Failed to shorten URL');
        }

        const data = await response.json();
        console.log(data.id);
        return data.id; // Assuming your backend API returns a field named 'shortUrl' containing the shortened URL
    } catch (error) {
        console.error('Error shortening URL:', error);
        return null;
    }
}


// Function to handle the click event on the "Shorten URL" button
async function handleShortUrl(event) {
    event.preventDefault(); // Prevent form submission

    const longUrl = document.getElementById('d_url').value;
    const shortenedUrl = await shortenUrl(longUrl);
    console.log(shortenedUrl);

    if (shortenedUrl) {
        const completeShortenedUrl = "https://1f5d-103-16-69-133.ngrok-free.app/" + shortenedUrl;

        // Display the shortened URL
        document.getElementById('short_url').innerHTML = completeShortenedUrl;

        // Set href attribute to the complete shortened URL
        document.getElementById('short_url').setAttribute('href', completeShortenedUrl);

    } else {
        // Error handling if URL couldn't be shortened
        alert('Failed to shorten URL. Please try again later.');
    }
}

// Call the function when the "Short URL" button is clicked
document.querySelector('form').addEventListener('submit', handleShortUrl);
