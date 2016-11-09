export class Controller {
    input
    savedInput

    constructor() {
        this.input = {
            up: false,
            down: false,
            right: false,
            left: false,
            space: false,
        };
        this.clear();
    }

    isAnyPressed() {
        return this.input.up |
            this.input.down |
            this.input.right |
            this.input.left;
    }

    clear() {
        this.savedInput = {
            up: false,
            down: false,
            right: false,
            left: false,
            space: false,
        };
    }

    attach() {
        window.addEventListener('keydown', (event) => {
            let preventDefault = false
            switch (event.key) {
                case "ArrowUp":
                case "w":
                    preventDefault = true
                    this.input.up = true
                    this.savedInput.up = true
                    break
                case "ArrowLeft":
                case "a":
                    preventDefault = true
                    this.input.left = true
                    this.savedInput.left = true
                    break
                case "ArrowRight":
                case "d":
                    preventDefault = true
                    this.input.right = true
                    this.savedInput.right = true
                    break
                case "ArrowDown":
                case "s":
                    preventDefault = true
                    this.input.down = true
                    this.savedInput.down = true
                    break
                case " ":
                    preventDefault = true
                    this.input.space = true
                    this.savedInput.space = true
            }
            if (preventDefault) {
                event.preventDefault()
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case "ArrowUp":
                case "w":
                    this.input.up = false
                    break
                case "ArrowLeft":
                case "a":
                    this.input.left = false
                    break
                case "ArrowRight":
                case "d":
                    this.input.right = false
                    break
                case "ArrowDown":
                case "s":
                    this.input.down = false
                    break
                case " ":
                    this.input.space = false
            }
        });
    }
}
