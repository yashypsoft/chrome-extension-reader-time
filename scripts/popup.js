const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*",
    ],
});

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    element.querySelector("a").addEventListener("click", async () => {
        // need to focus window as well as the active tab
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
}
document.querySelector("ul").append(...elements);


const button = document.querySelector("button");
button.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  console.log(group);
//   await chrome.tabs.update({url: 'http://example.com'});

//   await chrome.tabs.update(group, { title: "DOCS" });
});


// const clipboardList = document.getElementById("clipboard-list");

// chrome.action.onClicked.addListener(() => {
//   chrome.storage.local.get("clipboard", (data) => {
//     const clipboard = data.clipboard || [];
//     clipboardList.innerHTML = clipboard
//       .map((text) => `<li>${text}</li>`)
//       .join("");
//   });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.local.set({ clipboard: [] });
// });

// chrome.runtime.onMessage.addListener((request) => {
//     debugger;
//     if (request.type === "clipboard") {
//         chrome.storage.local.get("clipboard", (data) => {
//           const clipboard = data.clipboard || [];
//           clipboard.unshift(request.text);
//           if (clipboard.length > 10) {
//             clipboard.pop();
//           }
//           chrome.storage.local.set({ clipboard });
//           clipboardList.innerHTML = clipboard
//             .map((text) => `<li>${text}</li>`)
//             .join("");
//         });
//       }
      
// });
