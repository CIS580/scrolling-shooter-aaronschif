// type State = Iterator<any>

interface ControlState extends Iterator<null|ControlState> {
    next({dt: number})
}

interface RenderState extends Iterator<any> {
    next({dt: number, ctx: CanvasRenderingContext2D})
}

export class Drawable {
    controlState: ControlState
    renderState: RenderState

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

    *baseControlState () {while (true) {yield null}}
    *baseRenderState () {while (true) {yield null}}
}
