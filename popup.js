chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getFilename" }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    const el = document.getElementById("artifact-name");
    el.innerHTML = `${response.filename + ` - Claude` || "No artifact detected"}`;
  });
});

document.getElementById("save-btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "save" }, (response) => {
      if (!response.success) {
        console.error(response.error);
        return;
      }

      const { markdown } = response;
      const filename = response.filename + ` - Claude`;

      fetch(`https://127.0.0.1:27124/vault/${filename}.md`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CONFIG.API_KEY}`,
          "Content-Type": "text/markdown",
        },
        body: markdown,
      })
        .then((res) => {
          const status = document.getElementById("status");
          if (res.ok) {
            status.textContent = "Saved";
            status.className = "success";
          } else {
            status.textContent = "Error saving";
            status.className = "error";
          }
        })
        .catch(() => {
          const status = document.getElementById("status");
          status.textContent = "Could not reach Obsidian";
          status.className = "error";
        });
    });
  });
});
