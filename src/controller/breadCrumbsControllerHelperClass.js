class BreadCrumbsControllerHelperClass {
    constructor(breadCrumbs) {
        this.breadCrumbs = breadCrumbs
    }

    insertLast(dir) {
        this.breadCrumbs.push(dir + "/");
    }

    removeLast() {
        return this.breadCrumbs.pop()
    }

    getBreadCrumbs() {
        return this.breadCrumbs
    }

    getLength() {
        return this.breadCrumbs.length
    }

    isEmpty() {
        return this.getLength() === 0
    }

    joinArr(between) {
        return this.getBreadCrumbs().join(between)
    }
}

module.exports = BreadCrumbsControllerHelperClass