// type State = Iterator<any>

interface State extends Iterator<any> {

}

export class Drawable {
    controlState: State
    renderState: State

    constructor() {
        this.controlState = this.baseControlState.bind(this)();
        this.renderState = this.baseRenderState.bind(this)();
    }

    update(dt) {
        let cur = this.controlState.next({dt: dt});
        if (cur.value != null) {
            this.controlState = cur.value;
        } else if (cur.done) {
            this.controlState = this.baseControlState.bind(this)();
        }
    }

    render(dt, ctx) {
        let cur = this.renderState.next({dt: dt, ctx: ctx});
        if (cur.value != null) {
            this.renderState = cur.value;
        } else if (cur.done) {
            this.renderState = this.baseRenderState.bind(this)();
        }
    }

    *baseControlState () {}
    *baseRenderState () {}
}
