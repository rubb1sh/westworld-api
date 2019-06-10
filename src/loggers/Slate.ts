export enum Position {
    LEFT = 1,
    CENTER,
    RIGHT,
}

interface ExtensionOptions {
    length: number;
    position: Position;
}

interface SlateLineOptions {
    prefix: string;
    suffix: string;
}

export default class Slate {
    private constructor() {}

    public static write(
        messages: string[],
        position: Position = Position.LEFT,
    ) {
        const longestMessage: string = messages.reduce(
            Slate.toLongestMessage,
            '',
        );
        const stackedMessage: string = messages.reduce(
            Slate.stackMessage(longestMessage.length, position),
            '',
        );
        const slateWidth = longestMessage.length;

        Slate.open(slateWidth);
        console.log(`${stackedMessage}`);
        Slate.close(slateWidth);
        console.log();
    }

    private static toLongestMessage(
        longestMessage: string,
        message: string,
    ): string {
        if (message.length > longestMessage.length) {
            return message;
        }
        return longestMessage;
    }

    private static getExtendedMessage(
        message: string,
        extension: ExtensionOptions = { length: 0, position: Position.LEFT },
    ) {
        let extendedMessage = message;

        switch (extension.position) {
            // Fill with spaces on the right
            case Position.LEFT: {
                extendedMessage = Array.from({
                    length: extension.length,
                }).reduce(function extendMessage(
                    extendedMessage: string,
                    item: any,
                ) {
                    return extendedMessage + ' ';
                },
                message);
                break;
            }
            // Fill with spaces on both sides (left & right)
            // case Position.CENTER: {
            //     extendedMessage = Array
            //         .from({ length: extension.length })
            //         .reduce(function extendMessage(extendedMessage: string, item: any) {
            //             return extendedMessage + ' '
            //         }, message)
            //     break
            // }
            // Fill with spaces on the left
            case Position.RIGHT: {
                extendedMessage = Slate.prepend(message, extension.length);
                break;
            }
        }

        return extendedMessage;
    }

    private static prepend(message: string, length: number) {
        return Array.from({ length }).reduce(function extendMessage(
            extendedMessage: string,
            item: any,
        ) {
            return ' ' + extendedMessage;
        },
        message);
    }

    private static stackMessage(maxLength: number, position: Position) {
        return function toStackedMessage(
            stackedMessage: string,
            message: string,
        ): string {
            if (message.length < maxLength) {
                const length = maxLength - message.length;
                const extension: ExtensionOptions = { length, position };
                message = Slate.getExtendedMessage(message, extension);
            }
            if ('' === stackedMessage) {
                return `| ${message} |`;
            }
            return `${stackedMessage}\n| ${message} |`;
        };
    }

    private static writeLine(
        length: number,
        pattern = '-',
        options: SlateLineOptions,
    ) {
        const { prefix, suffix } = options;
        const stackedPattern = Array.from({ length })
            .map(item => pattern)
            .join('');
        console.log(`${prefix}${stackedPattern}${suffix}`);
    }

    private static open(slateWidth: number) {
        const options: SlateLineOptions = { prefix: ' ', suffix: ' ' };
        Slate.writeLine(slateWidth + 2, '_', options);
    }

    private static close(slateWidth: number) {
        const options: SlateLineOptions = { prefix: '|', suffix: '|' };
        Slate.writeLine(slateWidth + 2, '_', options);
    }
}
