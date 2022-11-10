export type CommandButton = {
    icon: string;
    id: any;
    handler: (focus: any) => any;
};

export function createHandler (
    name: string,
    ...params: any
): CommandButton['handler'] {
    return (focus: any) => {
        return focus[name](...params).run();
    };
}

export function generateButtons () {
    const buttons: CommandButton[] = [
        {
            icon: 'mdi-format-bold',
            handler: createHandler('toggleBold'),
            id: 'bold'
        },
        {
            icon: 'mdi-format-italic',
            handler: createHandler('toggleItalic'),
            id: 'italic'
        },
        {
            icon: 'mdi-code-braces',
            handler: createHandler('toggleCode'),
            id: 'code'
        },
        {
            icon: 'mdi-code-tags',
            handler: createHandler('toggleCodeBlock'),
            id: 'code-block'
        },
        {
            icon: 'mdi-format-vertical-align-center',
            handler: createHandler('setHorizontalRule'),
            id: 'hr'
        }
    ];

    for (let level = 1; level <= 6; ++level) {
        buttons.push({
            icon: `mdi-format-header-${level}`,
            handler: createHandler('toggleHeading', { level }),
            id: ['heading', { level }]
        });
    }

    ['left', 'right', 'center', 'justify'].forEach((align) => {
        buttons.push({
            icon: 'mdi-format-align-' + align,
            handler: createHandler('setTextAlign', align),
            id: ['align', { align }]
        });
    });

    // buttons.push({
    //     icon: 'mdi-format-clear',
    //     handler: createHandler('unsetTextAlign'),
    //     id: 'unsetTextAlign'
    // });

    return buttons;
}
