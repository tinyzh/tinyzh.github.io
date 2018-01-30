class Route {
    constructor () {
        this.urls = []
        this.handles = {}
        window.addEventListener('popstate', (e) => {
            const state = e.state || {}
            const url = state.url || null

            if (url) {
                this.refresh(url)
            }
        })

        const $routeController = $('a[data-role=custom-history]')

        $routeController.on('click', e => {
            e.preventDefault()
            const link = $(e.target).attr('href')
            history.pushState({ url: link }, '', link)
            this.refresh(link)
        })
    }

    set (route, handle) {
        if (this.urls.indexOf(route) === -1) {
            this.urls.push(route)
            this.handles[route] = handle
        }
    }

    refresh (route) {
        if (this.urls.indexOf(route) === -1) throw new Error('请不要这样调用, 路由表中不存在!')
        this.handles[route]()
    }
}