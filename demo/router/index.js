const $routeController = $('a[data-role=custom-history]')

const app = new Route()

app.set('/1', function () {
    $('#app').html('1')
})

app.set('/2', function () {
    $('#app').html('2')
})
