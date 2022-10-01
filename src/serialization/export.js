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

const exportToSb3 = (projectData, runtime) => {
    console.log(projectData);
    for (const target of projectData.targets) {
        // const reporters = getReporters(target.blocks);
        for (const blockId in target.blocks) {
            const block = target.blocks[blockId];
            const [extensionId] = block.opcode.split('_');
            if (INTERNAL_EXTENSIONS.includes(extensionId)) continue;
            
            if (!block.topLevel && !block.next && block.parent) {
                if (!block.fields) block.fields = {};
                block.fields.VALUE = [`${block.opcode}`, undefined];
                block.inputs = {};
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
};

module.exports = exportToSb3;