export function header() {
    const root = document.createElement('header')
    {
        root.style.backgroundColor = '#333'
        root.style.padding = '8px'

        const appTitle = document.createElement('h1')
        {
            appTitle.textContent = 'Kiwibit'
            appTitle.style.fontSize = '24px'
            appTitle.style.fontWeight = 'normal'
            appTitle.style.margin = '0'
            appTitle.style.color = 'white'
        }

        root.appendChild(appTitle)
    }

    return root
}
