const importFromSb3 = (json, runtime, zip, isSingleSprite) => {
    if (runtime.debug) console.log(json);

    json.extensions = [];
    for (const target of json.targets) {
        for (const blockId in target.blocks) {
            const block = target.blocks[blockId];
            
            switch (block.opcode) {
            case 'procedures_return': {
                if (block.inputs.RETURN) {
                    block.inputs.VALUE = block.inputs.RETURN;
                    delete block.inputs.RETURN;
                }
                break;
            }
            case 'procedures_call_with_return': {
                block.opcode = 'procedures_call_return';
                break;
            }
            case 'procedures_definition': {
                const protoId = Array.isArray(block.inputs.custom_block) ?
                    block.inputs.custom_block[1] :
                    block.inputs.custom_block.block;
                const prototypeBlock = target.blocks[protoId];
    
                // headless
                if (!prototypeBlock) break;
                
                if (prototypeBlock.mutation.isreporter === 'true') {
                    block.opcode = 'procedures_definition_return';
                    prototypeBlock.opcode = 'procedures_prototype_return';
                }
                break;
            }
            default:
                // null
            }
        }
    }
};

module.exports = importFromSb3;