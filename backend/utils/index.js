function setMainView(view) {
    return {
        header: 'partials/header',
        main: `partials/main/${view}`,
        footer: 'partials/footer'
    }
}

function setNavs(currentHref, navs, isAuthenticated) {
    const _navs = navs.map(nav => {
        nav.className = " ";
        if(nav.href === currentHref) {
            nav.className = 'active'
        }
        return nav;
    }).filter(nav => {
        if (!isAuthenticated) {
            return !nav.isPrivate;
        } else {
        return nav.isPrivate || nav.isPrivate === un
        }
    });
    return {currentHref, navs: _navs}
}

module.exports = { setMainView, setNavs};