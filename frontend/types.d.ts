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
    path?: string[];
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

type ImportZipResult = { success: boolean; dest: string };

interface Window {
    electron: {
        requestSelectedUser: () => void;
        getSelectedUser: (callback: (event: any, user: User) => void) => void;
        removeSelectedUserListener: (callback: (event: any, user: User) => void) => void;
        updateSelectedUserConfigs: (configs: Config[]) => void;
        syncSelectedUserToUsers: () => void;
        changeSelectedUser: (user: User) => void;
        onAssignmentListRefresh: (callback: () => void) => void;
        removeAssignmentListRefreshListener: (callback: () => void) => void;

        addAssignment: (assignment: Assignment) => Promise<{ success: boolean; error?: string }>;
        setSelectedAssignment: (title: string) => void;
        getSelectedAssignment: (callback: (event: any, title: string) => void) => void,
        requestSelectedAssignment: () => void,
        removeSelectedAssignmentListener: (callback:(event:any, title:string) => void) => void,

        addConfig: (config: Config) => Promise<{ success: boolean; error?: string }>;
        openNewAssignmentWindow: () => void;
        openConfigurationsWindow: () => void;
        closeCurrentWindow: () => void;
        importZipFiles: (assignmentTitle: string | null) => Promise<ImportZipResult | null>;
    };
}