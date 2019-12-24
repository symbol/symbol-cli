export const privateKeyChecker = async (argv: string): Promise<boolean> => {
    if (argv.length !== 64 || !/^[0-9a-fA-F]+$/.test(argv)) {
        return false;
    }
    return true;
};

export const urlChecker = async (argv: string): Promise<boolean> => {
    const reg = /^(https?:\/\/)?[\w|.]+(:\d{0,5})?$/g;
    if (reg.test(argv)) {
        return true;
    }
    return false;
};

export const profileNameChecker = async (argv: string): Promise<boolean> => {
    const reg = /\w+/g;
    if (reg.test(argv)) {
        return true;
    }
    return false;
};
