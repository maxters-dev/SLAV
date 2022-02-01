export type CommandButton = {
    icon: string;
    id: any;
    handler: Function;
}

const createHandler = (name: string, ...params: any): Function => {
    return (focus: any) => {
        return focus[name](...params).run();
    };
};

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
            icon: 'mdi-code-tags',
            handler: createHandler('toggleCode'),
            id: 'code'
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

    return buttons;
}
