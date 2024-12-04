

export async function runScript<Args extends any[]>(script: (...args: Args) => void, args: Args, tab?: chrome.tabs.Tab) {
  tab = tab ?? await activeTab()
  await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: script, args,
    injectImmediately: true
  })
}

export async function log(msg: string, tab?: chrome.tabs.Tab) {
  await runScript(msg => console.log(msg), [msg], tab)
}

export async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  return tabs[0]
}

export async function navigate(url: string, tab?: chrome.tabs.Tab) {
  tab = tab ?? await activeTab()
  if (tab.url === url)
    return
  await chrome.tabs.update(tab.id!, { url })
  return new Promise(resolve => setTimeout(resolve, 1000))
}