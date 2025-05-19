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
    inputFile?: string;
    expectedOutputFile?: string;
    compareOptions?: string[];
    path?: string[];
};

type Config = {
    name: string;
    language: string;
    compile?: CompileConfig;
    run: RunConfig;
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
        selectTxtFile: () => Promise<string | null>;
        openNewAssignmentWindow: () => void;
        deleteAssignment: (assignmentTitle: string) => Promise<boolean>;

        addConfig: (config: Config) => Promise<{ success: boolean; error?: string }>;
        openConfigurationsWindow: () => void;
        closeCurrentWindow: () => void;
        importZipFiles: (assignmentTitle: string | null) => Promise<ImportZipResult | null>;
        
        requestZipFileNames: () => void;
        getZipFileNames: (callback: (event: any, zipNames: string[]) => void) => void,
        removeZipFileNameListener: (callback: (event: any, zipNames: string[]) => void) => void,
        openZipFolder: (zipName: string) => Promise<void>;
        deleteZipFile: (zipName: string) => void,

        exportResults: () => Promise<{ success: boolean; error?: string }>;
        importConfigsFromJson: () => Promise<{ success: boolean; error?: string }>;
        exportConfigsToJson: () => Promise<{ success: boolean }>;
        openUserManual: () => Promise<{ success: boolean; error?: string }>;
    };
}