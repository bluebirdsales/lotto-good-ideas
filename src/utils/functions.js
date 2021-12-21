export function hexToRGBA(h,a = 1) {
    let r = 0,
        g = 0,
        b = 0;

    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + [3];
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + [6];
    }

    return "rgba("+ +r + ", "+ +g + ", "+ +b + ", "+ +a +")"
}
