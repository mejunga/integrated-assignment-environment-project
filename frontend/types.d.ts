type Config = {
    language: string;
    compile: CompileConfig;
    run: RunConfig;
    inputFile?: string;
    expectedOutputFile?: string;
    compareOptions?: string[];
}

type CompileConfig = {
    command: string;
    args: string[];
}

type RunConfig = {
    command: string;
    args: string[];
}

interface Window {
    electron: {
        sendConfig: (config: Config) => void;
    }
}