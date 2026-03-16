chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "save") {
        const artifactContent = document.getElementById("wiggle-file-content")

        if (!artifactContent) {
            sendResponse({ success: false, error: "No artifact found - make sure its open"})
            return 
        }

        const turndownService = new TurndownService({
            headingStyle: 'atx'
        })
        turndownService.addRule('table', {
            filter: 'table',
            replacement: function(content, node) {
                return '\n' + node.outerHTML + '\n'
            }
        })
        const markdown = turndownService.turndown(artifactContent.innerHTML)

        const artifactButton = document.querySelector('[aria-label^="Open artifact:"]')
        const rawLabel = artifactButton ? artifactButton.getAttribute("aria-label") : null
        const filename = rawLabel ? rawLabel.replace("Open artifact: ", "") : `claude-artifact-${Date.now()}`

        sendResponse({ success: true, markdown, filename })
    }
    if (request.action === "getFilename") {
        const artifactButton = document.querySelector('[aria-label^="Open artifact:"]')
        const rawLabel = artifactButton ? artifactButton.getAttribute("aria-label") : null
        const filename = rawLabel ? rawLabel.replace("Open artifact: ", "") : null
        sendResponse({ filename })
    }
    return true
})