import rough from 'roughjs/bin/rough';

// We just need the generator for SVG path strings
// so that Konva can consume them in <Path data={} />
export const generator = rough.generator();

/**
 * Creates Konva-compatible path data from a rough.js drawable
 * @param {Drawable} drawable - The output from roughGenerator (e.g. generator.rectangle())
 * @returns {string} - Combined SVG path data
 */
export const getSvgPathFromStroke = (strokes) => {
    if (!strokes || !strokes.length) return '';
    let path = '';
    for (const set of strokes) {
        for (const op of set.ops) {
            const data = op.data;
            switch (op.op) {
                case 'move':
                    path += `M${data[0]} ${data[1]} `;
                    break;
                case 'bcurveTo':
                    path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
                    break;
                case 'lineTo':
                    path += `L${data[0]} ${data[1]} `;
                    break;
                default:
                    break;
            }
        }
    }
    return path.trim();
};
