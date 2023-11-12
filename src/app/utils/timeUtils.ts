class TimeUtils {
    convertToMilliseconds(input: string) {
        const units = input.slice(-1);
        const value = parseInt(input.slice(0, -1));

        switch(units) {
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'm':
                return value * 60 * 1000;
            case 's':
                return value * 1000;
            default:
                return 'Invalid input';
        }
    }
}

export default new TimeUtils();