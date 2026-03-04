export type CompileStatus = "idle" | "parsing" | "ir_gen" | "codegen" | "done";

export interface CompileEvent {
    type: "stage" | "error" | "complete";
    stage?: CompileStatus;
    errors?: any[];
    artifacts?: any;
}
