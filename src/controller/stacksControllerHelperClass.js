class StacksControllerHelperClass {
    constructor() {
        this.stacks = []
    }

    insertFirst(arr) {
       this.stacks.unshift(...arr);
    }

    removeFirst() {
        return this.stacks.shift()
    }

    getStacks() {
        return this.stacks
    }

    getFirst() {
        return this.stacks[0]
    }

    getLength() {
        return this.stacks.length
    }

    isEmpty() {
        return this.getLength() === 0
    }


}

module.exports = StacksControllerHelperClass