const uid = require('../util/uid');
let processedBlocks = new Set();

const INTERNAL_EXTENSIONS = ['argument', 'colour', 'control',
    'data', 'event', 'looks', 'math', 'motion', 'operator',
    'procedures', 'sensing', 'sound', 'pen', 'videoSensing',
    'ev3', 'boost', 'gdxfor', 'makeymakey', 'music', 'wedo2',
    'microbit', 'speech2text', 'text2speech', 'translate',
];

const blacklistOpcode = [
    'procedures_call_return',
    'procedures_return',
    'procedures_definition_return',
    'procedures_prototype_return'
];

const getReporters = function (blocks) {
    const reporters = new Set();
    for (const blockId in blocks) {
        const block = blocks[blockId];
        for (const inputId in block.inputs) {
            if (inputId.startsWith('SUBSTACK')) continue;
            
            const input = block.inputs[inputId];
            if (input.length > 2) {
                reporters.add(input[1]);
            }
        }
    }
    return reporters;
};

const convertUnknownBlocks = (blockId, blocks, reporters) => {
    const block = blocks[blockId];
    if (!block || !block.opcode) return;
    const [extensionId] = block.opcode.split('_');
    
    if (INTERNAL_EXTENSIONS.includes(extensionId) && !blacklistOpcode.includes(block.opcode)) return;
    block.inputs = {};
    block.fields = {};
    if (reporters.has(blockId)) {
        if (block.mutation) delete block.mutation;
        block.fields.VALUE = [`${block.opcode}`, undefined];
        block.opcode = 'argument_reporter_boolean';
    } else {
        block.mutation = {};
        block.mutation.proccode = `${block.opcode}`;
        block.mutation.children = [];
        block.mutation.tagName = 'mutation';
        block.opcode = 'procedures_call';
    }
};

const findCallReturn = (block, blocks, currentBlockId) => {
    console.log('find call return', block);
    const returns = [];
    for (const inputId in block.inputs) {
        const input = block.inputs[inputId];
        // Nested, for LLK/scratch It's input.block !== input.shadow
        if (input.length > 2) {
            console.log('nested input', input, ', find call return');
            const result = findCallReturn(blocks[input[1]], blocks, input[1]);
            for (const item of result) returns.push(item);
        }
    }
    if (block.opcode === 'procedures_call_return') {
        returns.push(currentBlockId);
    }
    return returns;
};

const makeBlock = ({
    opcode,
    inputs = {},
    fields = {},
    mutation
}) => {
    // todo
};

const convertCustomReporter = (block, blocks, currentBlockId) => {
    const returns = findCallReturn(block, blocks, currentBlockId);
};

const walkStack = (entryBlockId, blocks) => {
    console.log('walkStack', entryBlockId);
    let currentBlockId = entryBlockId;
    while (currentBlockId) {
        const currentBlock = blocks[currentBlockId];
        // Convert unknown blocks to headless procedures call.
        convertUnknownBlocks(currentBlockId, blocks, reporters);
        // Convert procedures_call_return to procedures_call.
        convertCustomReporter(currentBlock, blocks, currentBlockId);

        // go to next block
        if (currentBlock.opcode.startsWith('control_') && 'SUBSTACK' in currentBlock.inputs) {
            const substackInput = currentBlock.inputs.SUBSTACK;
            console.log('substack', substackInput);
            if (substackInput.length > 3) walkStack(substackInput[1], blocks);
        }
        processedBlocks.add(currentBlockId);
        currentBlockId = currentBlock.next;
    }
};

const exportToSb3 = (projectData, runtime) => {
    if (runtime.debug) console.log(projectData);
    
    for (const target of projectData.targets) {
        const reporters = getReporters(target.blocks);
        for (const blockId in target.blocks) {
            // Convert unknown blocks to headless procedures call.
            convertUnknownBlocks(blockId, target.blocks, reporters);
        }
    }
    
    // unnecessary to store extensions
    if (projectData.extensions) projectData.extensions = [];
};

module.exports = exportToSb3;