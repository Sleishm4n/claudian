
document.getElementById("save-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "save" }, (response) => {
      if (!response.success) {
        console.error(response.error)
        return
      }

      const { markdown, filename} = response

      fetch(`https://127.0.0.1:27124/vault/${filename}.md`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${CONFIG.API_KEY}`,
            "Content-Type": "text/markdown"
        },
        body: markdown
      })
      .then(res => {
        if (res.ok) {
            console.log(`Saved: ${filename}.md`)
        } else {
            res.text().then(t => console.error("Obsidian error:", t))
        }
      })
      .catch(err => console.error("Fetch error:", err))
    })
  })
})