const INTERNAL_EXTENSIONS = [
    'argument',
    'colour',
    'control',
    'data',
    'event',
    'looks',
    'math',
    'motion',
    'operator',
    'procedures',
    'sensing',
    'sound',
    'pen',
    'videoSensing',
    'ev3',
    'boost',
    'gdxfor',
    'makeymakey',
    'music',
    'microbit',
    'speech2text',
    'text2speech',
    'translate',
    'wedo2'
];

/**
 * Get the reporter blocks to replace them.
 * @param {object} blocks - A deserialized blocks object.
 * @return {set} A set contain the id of reporter blocks
 */
const getReporters = function (blocks) {
    const reporters = new Set();
    // console.log("开始获取Reporter", blocks);
    for (const blockId in blocks) {
        const block = blocks[blockId];
        // console.log("开始遍历block", block);
        for (const inputId in block.inputs) {
            const input = block.inputs[inputId];
            // console.log("遍历input", input);
            if (input.block && input.block != input.shadow) {
                if (input.name == 'SUBSTACK' || input.name == 'SUBSTACK2') continue;
                else reporters.add(input.block);
            }
        }
    }
    return reporters;
};

const exportToSb3 = (projectData, runtime) => {
    console.log(projectData);
    for (const target of projectData.targets) {
        const reporters = getReporters(target.blocks);
        for (const blockId in target.blocks) {
            const block = target.blocks[blockId];
            const [extensionId] = block.opcode.split('_');
            if (INTERNAL_EXTENSIONS.includes(extensionId)) continue;
            
            if (reporters.has(block.id)) {
                if (!block.fields) block.fields = {};
                block.fields.VALUE = {
                    name: 'VALUE',
                    value: `${block.opcode}`
                };
                block.opcode = 'argument_reporter_boolean';
            } else {
                if (!block.mutation) block.mutation = {};
                block.mutation.proccode = `${block.opcode}`;
                block.mutation.children = [];
                block.mutation.tagName = 'mutation';
                block.opcode = 'procedures_call';
            }
        }
    }
    // return projectData;
};

module.exports = exportToSb3;