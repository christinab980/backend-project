function setMainView(view) {
    return {
        header: 'partials/header',
        main: `partials/main/${view}`,
        footer: 'partials/footer'
    }
}

module.exports = { setMainView };