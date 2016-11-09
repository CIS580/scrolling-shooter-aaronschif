
export class Vector {
    static scale(a, scale: number) {
        return {x: a.x * scale, y: a.y * scale};
    }

    static add(a, b) {
        return {x: a.x + b.x, y: a.y + b.y};
    }

    static subtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    static rotate(a, angle) {
        return {
            x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
            y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
        }
    }

    static dotProduct(a, b) {
        return a.x * b.x + a.y * b.y
    }

    static magnitude(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    static normalize(a) {
        var mag = Vector.magnitude(a);
        return {x: a.x / mag, y: a.y / mag};
    }

}
