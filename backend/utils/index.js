function setMainView(view) {
    return {
        header: 'partials/header',
        main: `partials/main/${view}`,
        footer: 'partials/footer'
    }
}

function setNavs(currentHref, navs) {
    const _navs = navs.map(nav => {
        nav.className = " ";
        if(nav.href === currentHref) {
            nav.className = 'active'
        }
        return nav;
    })
    return {navs}
}

module.exports = { setMainView, setNavs};