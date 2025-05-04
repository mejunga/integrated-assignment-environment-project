type User = {
    name: string;
    id: string;
    configs: Config[];
    assignments: Assignment[];
    iconDir?: string;
};

type Student = {
    id: string;
    fullName: string;
};

type Assignment = {
    title: string;
    config: Config;
    compareOptions?: string[];
};

type Config = {
    name: string;
    language: string;
    compile?: CompileConfig;
    run: RunConfig;
    inputFile?: string;
    expectedOutputFile?: string;
    interpreted: boolean; 
};

type CompileConfig = {
    command: string;
    args: string[];
};

type RunConfig = {
    command: string;
    args: string[];
};

type StudentResult = {
    studentId: string;
    submitted: boolean;
    compileSuccess?: boolean;
    runSuccess?: boolean;
    outputMatchesExpected?: boolean;
    actualOutput?: string;
    errorMessage?: string;
    logs?: string[];
};

interface Window {
    electron: {
        getSelectedUser: (callback: (event: any, user: User) => void) => void;
        requestSelectedUser: () => void;
        changeSelectedUser: (user: User) => void;
        removeSelectedUserListener: (callback: (event: any, user: User) => void) => void;
        openConfigurationsWindow: () => void;
        updateSelectedUserConfigs: (configs: Config[]) => void;
        syncSelectedUserToUsers: () => void;
        addConfig: (config: Config) => Promise<{ success: boolean; error?: string }>;
        openNewAssignmentWindow: () => void;
        openConfigurationsWindowWithSource: (string) => void;
        getWindowSource: (callback: (source: string | null) => void) => void;
        closeCurrentWindow: () => void;
        addAssignment: (assignment: Assignment) => Promise<{ success: boolean; error?: string }>;
    };
}